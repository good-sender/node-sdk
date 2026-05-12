# DomainListResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**domains** | [**Array&lt;Domain&gt;**](Domain.md) |  | [default to undefined]
**nextCursor** | **string** | Cursor to retrieve the next page of results. Omitted if there are no more results. | [optional] [default to undefined]

## Example

```typescript
import { DomainListResponse } from '@goodsender/sdk';

const instance: DomainListResponse = {
    domains,
    nextCursor,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
