---
id: faastjs.faasterrornames
title: FaastErrorNames enum
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[faastjs](./faastjs.md) &gt; [FaastErrorNames](./faastjs.faasterrornames.md)

## FaastErrorNames enum

Possible FaastError names. See [FaastError](./faastjs.faasterror.md)<!-- -->. To test for errors matching these names, use the static method [FaastError](./faastjs.faasterror.md)<!-- -->.hasCauseWithName().

<b>Signature:</b>

```typescript
export declare enum FaastErrorNames 
```

## Enumeration Members

|  Member | Value | Description |
|  --- | --- | --- |
|  ECANCEL | <code>&quot;FaastCancelError&quot;</code> | The function invocation was cancelled by user request. |
|  ECONCURRENCY | <code>&quot;FaastConcurrencyError&quot;</code> | The remote cloud function failed to execute because of limited concurrency. |
|  ECREATE | <code>&quot;FaastCreateFunctionError&quot;</code> | Could not create the remote cloud function or supporting infrastructure. |
|  EEXCEPTION | <code>&quot;UserException&quot;</code> | The exception was thrown by user's remote code, not by faast.js or the cloud provider. |
|  EGENERIC | <code>&quot;VError&quot;</code> | Generic error. See [FaastError](./faastjs.faasterror.md)<!-- -->. |
|  EMEMORY | <code>&quot;FaastOutOfMemoryError&quot;</code> | The remote cloud function exceeded memory limits. |
|  ESERIALIZE | <code>&quot;FaastSerializationError&quot;</code> | The arguments passed to the cloud function could not be serialized without losing information. |
|  ETIMEOUT | <code>&quot;FaastTimeoutError&quot;</code> | The remote cloud function timed out. |
