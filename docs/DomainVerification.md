# DomainVerification

Per-record verification state for the domain. `verified` is the overall flag; the individual `*_verified` fields indicate which DNS records still need attention when `verified` is `false`. 

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**verified** | **boolean** | Overall verification status. True only when every required DNS record is in place. | [default to undefined]
**tracking_verified** | **boolean** | Whether the tracking subdomain CNAME is in place. | [default to undefined]
**return_path_verified** | **boolean** | Whether the return-path subdomain CNAME is in place. | [default to undefined]
**dkim1_verified** | **boolean** | Whether the first DKIM record is in place. | [default to undefined]
**dkim2_verified** | **boolean** | Whether the second DKIM record is in place. | [default to undefined]

## Example

```typescript
import { DomainVerification } from '@goodsender/sdk';

const instance: DomainVerification = {
    verified,
    tracking_verified,
    return_path_verified,
    dkim1_verified,
    dkim2_verified,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
