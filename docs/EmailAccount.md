# EmailAccount


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** | Recipient email address. | [default to undefined]
**name** | **string** | Optional display name for the recipient. Used in the To header on the consent email when present, and surfaced through the Dashboard. May be null when no name has been provided. | [optional] [default to undefined]
**domain** | **string** | Domain part of the email address. | [default to undefined]
**consentStatus** | **string** | Status of the recipient\&#39;s consent for receiving emails. \&#39;pending\&#39; &#x3D; awaiting consent email send, \&#39;requested\&#39; &#x3D; consent email dispatched, \&#39;failed\&#39; &#x3D; consent email delivery failed, \&#39;granted\&#39; &#x3D; recipient consented to receive emails, \&#39;denied\&#39; &#x3D; recipient declined to receive emails. | [default to undefined]
**engagementStatus** | **string** | Status of the recipient\&#39;s engagement with the emails. | [optional] [default to undefined]

## Example

```typescript
import { EmailAccount } from '@goodsender/sdk';

const instance: EmailAccount = {
    email,
    name,
    domain,
    consentStatus,
    engagementStatus,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
