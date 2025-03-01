---
id: faastjs.costmetric
title: CostMetric class
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[faastjs](./faastjs.md) &gt; [CostMetric](./faastjs.costmetric.md)

## CostMetric class

A line item in the cost estimate, including the resource usage metric measured and its pricing.

<b>Signature:</b>

```typescript
export declare class CostMetric 
```

## Remarks

The constructor for this class is marked as internal. Third-party code should not call the constructor directly or create subclasses that extend the `CostMetric` class.

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [comment?](./faastjs.costmetric.comment.md) | <code>readonly</code> | string | <i>(Optional)</i> An optional comment, usually providing a link to the provider's pricing page and other data. |
|  [informationalOnly?](./faastjs.costmetric.informationalonly.md) | <code>readonly</code> | boolean | <i>(Optional)</i> True if this cost metric is only for informational purposes (e.g. AWS's <code>logIngestion</code>) and does not contribute cost. |
|  [measured](./faastjs.costmetric.measured.md) | <code>readonly</code> | number | The measured value of the cost metric, in units. |
|  [name](./faastjs.costmetric.name.md) | <code>readonly</code> | string | The name of the cost metric, e.g. <code>functionCallDuration</code> |
|  [pricing](./faastjs.costmetric.pricing.md) | <code>readonly</code> | number | The price in USD per unit measured. |
|  [unit](./faastjs.costmetric.unit.md) | <code>readonly</code> | string | The name of the units that pricing is measured in for this metric. |
|  [unitPlural?](./faastjs.costmetric.unitplural.md) | <code>readonly</code> | string | <i>(Optional)</i> The plural form of the unit name. By default the plural form will be the name of the unit with "s" appended at the end, unless the last letter is capitalized, in which case there is no plural form (e.g. "GB"). |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [cost()](./faastjs.costmetric.cost.md) |  | The cost contribution of this cost metric. Equal to [CostMetric.pricing](./faastjs.costmetric.pricing.md) \* [CostMetric.measured](./faastjs.costmetric.measured.md)<!-- -->. |
|  [describeCostOnly()](./faastjs.costmetric.describecostonly.md) |  | Return a string with the cost estimate for this metric, omitting comments. |
|  [toString()](./faastjs.costmetric.tostring.md) |  | Describe this cost metric, including comments. |
