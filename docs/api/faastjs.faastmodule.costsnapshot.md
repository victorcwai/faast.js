---
id: faastjs.faastmodule.costsnapshot
title: FaastModule.costSnapshot() method
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[faastjs](./faastjs.md) &gt; [FaastModule](./faastjs.faastmodule.md) &gt; [costSnapshot](./faastjs.faastmodule.costsnapshot.md)

## FaastModule.costSnapshot() method

Get a near real-time cost estimate of cloud function invocations.

<b>Signature:</b>

```typescript
costSnapshot(): Promise<CostSnapshot>;
```
<b>Returns:</b>

Promise&lt;[CostSnapshot](./faastjs.costsnapshot.md)<!-- -->&gt;

a Promise for a [CostSnapshot](./faastjs.costsnapshot.md)<!-- -->.

## Remarks

A cost snapshot provides a near real-time estimate of the costs of the cloud functions invoked. The cost estimate only includes the cost of successfully completed calls. Unsuccessful calls may lack the data required to provide cost information. Calls that are still in flight are not included in the cost snapshot. For this reason, it is typically a good idea to get a cost snapshot after awaiting the result of [FaastModule.cleanup()](./faastjs.faastmodule.cleanup.md)<!-- -->.

Code example:

```typescript
const faastModule = await faast("aws", m);
try {
    // invoke cloud functions on faastModule.functions.*
} finally {
     await faastModule.cleanup();
     const costSnapshot = await faastModule.costSnapshot();
     console.log(costSnapshot);
}
```
