# EmailListResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**emails** | [**Array&lt;EmailAccount&gt;**](EmailAccount.md) |  | [default to undefined]
**nextCursor** | **string** | Cursor to retrieve the next page of results. Omitted if there are no more results. | [optional] [default to undefined]

## Example

```typescript
import { EmailListResponse } from '@goodsender/sdk';

const instance: EmailListResponse = {
    emails,
    nextCursor,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
