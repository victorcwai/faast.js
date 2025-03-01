---
id: faastjs.faastgoogle
title: faastGoogle() function
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[faastjs](./faastjs.md) &gt; [faastGoogle](./faastjs.faastgoogle.md)

## faastGoogle() function

The main entry point for faast with Google provider.

<b>Signature:</b>

```typescript
export declare function faastGoogle<M extends object>(fmodule: M, options?: GoogleOptions): Promise<GoogleFaastModule<M>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  fmodule | M | A module imported with <code>import * as X from &quot;Y&quot;;</code>. Using <code>require</code> also works but loses type information. |
|  options | [GoogleOptions](./faastjs.googleoptions.md) | <i>(Optional)</i> Most common options are in [CommonOptions](./faastjs.commonoptions.md)<!-- -->. Additional Google-specific options are in [GoogleOptions](./faastjs.googleoptions.md)<!-- -->. |

<b>Returns:</b>

Promise&lt;[GoogleFaastModule](./faastjs.googlefaastmodule.md)<!-- -->&lt;M&gt;&gt;
