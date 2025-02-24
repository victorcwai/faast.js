import test from "ava";
import { CloudWatchLogs } from "aws-sdk";
import { v4 as uuid } from "uuid";
import { faastAws, log, throttle } from "../index";
import { defaultGcWorker, clearLastGc } from "../src/aws/aws-faast";
import { getAWSResources } from "./fixtures/util-aws";
import * as functions from "./fixtures/functions";
import { checkResourcesCleanedUp, sleep, title } from "./fixtures/util";
import assert from "assert";

async function waitForLogGroupCreation(
    cloudwatch: CloudWatchLogs,
    logGroupName: string,
    message: string
) {
    let n = 0;
    while (true) {
        await sleep(1000);
        try {
            n++;
            const described = await cloudwatch
                .describeLogGroups({ logGroupNamePrefix: logGroupName })
                .promise();
            if (!described.logGroups) {
                continue;
            }
            const retrievedLogGroup = described.logGroups?.[0]?.logGroupName;
            if (!retrievedLogGroup) {
                continue;
            }
            assert(
                retrievedLogGroup === logGroupName,
                `Unexpected logGroupName: ${retrievedLogGroup}, expecting ${logGroupName}`
            );
            const logResult = await cloudwatch
                .filterLogEvents({ logGroupName })
                .promise();
            const events = logResult.events ?? [];
            // console.log(`[${n}] Found log group: ${logGroupName}`);
            let foundMessage = false;
            for (const event of events) {
                // console.log(
                //     `[${n}] ${event.logStreamName} ${event.eventId} ${event.timestamp} ${event.message}`
                // );
                if (event.message!.includes(message)) {
                    foundMessage = true;
                }
                if (foundMessage && event.message!.match(/REPORT RequestId/)) {
                    return;
                }
            }
        } catch (err: any) {
            console.error(`Transient error waiting for log group creation: ${err}`);
        }
    }
}

test.serial(title("aws", "garbage collects functions that are called"), async t => {
    // Idea behind this test: create a faast module and make a call. Then
    // cleanup while leaving the resources in place. Then create another faast
    // module and set its retention to 0, and use a synthetic gc worker to
    // observe and verify the garbage collector actually cleans up.
    const mod = await faastAws(functions, {
        gc: "off",
        mode: "queue",
        description: t.title,
        packageJson: {
            name: uuid(),
            dependencies: {
                tslib: "^1.9.1"
            }
        },
        maxRetries: 0
    });
    try {
        await mod.functions.consoleLog("gc-test-string");
        const { cloudwatch } = mod.state.services;
        const { logGroupName } = mod.state.resources;
        await waitForLogGroupCreation(cloudwatch, logGroupName, "gc-test-string");
        await mod.cleanup({ deleteResources: false, gcTimeout: 0 });

        // Create some work for gc to do by removing the log retention policy, gc
        // should add it back.
        const deleteRetentionPolicy = throttle({ concurrency: 1, retry: 5 }, () =>
            cloudwatch.deleteRetentionPolicy({ logGroupName }).promise()
        );
        await deleteRetentionPolicy();

        let deletedLayer = false;
        const { layer, FunctionName } = mod.state.resources;
        // log.gc.enabled = true;
        const mod2 = await faastAws(functions, {
            gc: "force",
            retentionInDays: 0,
            description: t.title,
            _gcWorker: async (work, services) => {
                switch (work.type) {
                    case "SetLogRetention":
                        // checkResourcesCleanedUp will verify the log group is
                        // deleted.
                        await defaultGcWorker(work, services);
                        break;
                    case "DeleteLayerVersion":
                        if (work.LayerName === layer!.LayerName) {
                            log.gc(`deleting layer ${work.LayerName}`);
                            await defaultGcWorker(work, services);
                            deletedLayer = true;
                        }
                        break;
                    case "DeleteResources":
                        if (work.resources.FunctionName === FunctionName) {
                            log.gc(`deleting resources for ${FunctionName}`);
                            await defaultGcWorker(work, services);
                        }
                }
            }
        });

        await mod2.cleanup({ gcTimeout: 0 });
        t.true(deletedLayer, "Deleted layer is true");
        await checkResourcesCleanedUp(t, await getAWSResources(mod, true));
    } finally {
        log.gc.enabled = false;
        await mod.cleanup({ deleteResources: true, deleteCaches: true, gcTimeout: 0 });
    }
});

test.serial(title("aws", "garbage collects functions that are never called"), async t => {
    const mod = await faastAws(functions, {
        gc: "off",
        mode: "queue",
        description: t.title,
        maxRetries: 0
    });
    try {
        await mod.cleanup({ deleteResources: false, gcTimeout: 0 });
        const { FunctionName } = mod.state.resources;
        const mod2 = await faastAws(functions, {
            gc: "force",
            retentionInDays: 0,
            description: t.title,
            _gcWorker: async (work, services) => {
                switch (work.type) {
                    case "DeleteResources":
                        if (work.resources.FunctionName === FunctionName) {
                            log.gc(`deleting resources for ${FunctionName}`);
                            await defaultGcWorker(work, services);
                        }
                }
            }
        });

        await mod2.cleanup({ gcTimeout: 0 });
        // Don't fail if a log group exists because we didn't wait for its
        // creation; it might be created by AWS after the cleanup occurs. The
        // reason is that the log group will only be created if there's an
        // invocation test, which only happens in the special case that the role
        // was recently created. Which is true for the nightly testsuite but
        // rarely elsewhere.
        const { logGroupResult, ...resources } = await getAWSResources(mod, true);
        await checkResourcesCleanedUp(t, resources);
    } finally {
        await mod.cleanup({ deleteResources: true, deleteCaches: true, gcTimeout: 0 });
    }
});

test.skip(title("aws", "garbage collection caching"), async t => {
    {
        // Run a real gc so the build account doesn't accumulate garbage.
        const mod = await faastAws(functions, { gc: "force", description: t.title });
        await mod.cleanup({ gcTimeout: 0 });
        t.is(await mod.state.gcPromise, "done");
    }

    {
        // Test the in-memory cache that prevents gc from multiple faast.js
        // instances from running at the same time.
        const mod = await faastAws(functions, { description: t.title });
        await mod.cleanup();
        t.is(await mod.state.gcPromise, "skipped");
    }

    {
        // Test the persistent cache that prevents gc from running too often
        // even across processes.
        clearLastGc();
        const mod = await faastAws(functions, { description: t.title });
        await mod.cleanup();
        t.is(await mod.state.gcPromise, "skipped");
    }
});
