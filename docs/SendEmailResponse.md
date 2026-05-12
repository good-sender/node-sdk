# SendEmailResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sent** | **number** | Number of emails sent (recipients had consent allowing delivery) | [default to undefined]
**declined** | **number** | Number of emails not sent because recipients did not have granted consent to receive emails | [default to undefined]

## Example

```typescript
import { SendEmailResponse } from '@goodsender/sdk';

const instance: SendEmailResponse = {
    sent,
    declined,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
