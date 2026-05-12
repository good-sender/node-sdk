# Domain


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**domain** | **string** | The domain name. | [default to undefined]
**tracking** | **string** | Subdomain used for click tracking. | [default to undefined]
**return_path** | **string** | Subdomain used for the return path. | [default to undefined]
**require_tls** | **boolean** | Whether outbound mail from this domain must be sent over TLS. | [default to undefined]
**verification** | [**DomainVerification**](DomainVerification.md) |  | [default to undefined]

## Example

```typescript
import { Domain } from '@goodsender/sdk';

const instance: Domain = {
    domain,
    tracking,
    return_path,
    require_tls,
    verification,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
