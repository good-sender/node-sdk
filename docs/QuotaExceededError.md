# QuotaExceededError


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **string** | Machine-readable error code. | [default to undefined]
**kind** | **string** | Whether the daily or monthly quota was exhausted. | [default to undefined]
**message** | **string** | Human-readable error message. | [default to undefined]
**limit** | **number** | Quota limit that was reached. | [default to undefined]
**used** | **number** | Number of emails already used against the quota. | [default to undefined]
**resetAt** | **string** | Timestamp at which the quota window resets. | [default to undefined]

## Example

```typescript
import { QuotaExceededError } from '@goodsender/sdk';

const instance: QuotaExceededError = {
    code,
    kind,
    message,
    limit,
    used,
    resetAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
