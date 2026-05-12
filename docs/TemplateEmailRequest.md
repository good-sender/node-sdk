# TemplateEmailRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**from** | [**Address**](Address.md) | Sender address (required) | [default to undefined]
**to** | [**Address**](Address.md) | Recipient address (required) | [default to undefined]
**subject** | **string** | The subject of the email (required) | [default to undefined]
**template** | [**TemplateEmailRequestTemplate**](TemplateEmailRequestTemplate.md) |  | [default to undefined]

## Example

```typescript
import { TemplateEmailRequest } from '@goodsender/sdk';

const instance: TemplateEmailRequest = {
    from,
    to,
    subject,
    template,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
