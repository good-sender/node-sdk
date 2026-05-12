# TrackingSettings

Controls email tracking and unsubscribe settings

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**opens** | **boolean** | Whether to track email opens | [optional] [default to undefined]
**clicks** | **boolean** | Whether to track link clicks | [optional] [default to undefined]
**unsubscribes** | **boolean** | Whether to track unsubscribes | [optional] [default to undefined]
**unsubscribe_group_id** | **number** | Optional unsubscribe group ID. If not specified, uses global unsubscribe list. This setting is ignored if unsubscribes is false. | [optional] [default to undefined]

## Example

```typescript
import { TrackingSettings } from '@goodsender/sdk';

const instance: TrackingSettings = {
    opens,
    clicks,
    unsubscribes,
    unsubscribe_group_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
