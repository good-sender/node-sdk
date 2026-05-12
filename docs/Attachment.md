# Attachment

Either inline_id or file_name is required. Content must be base64 encoded.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**file_name** | **string** | File name for the attachment | [optional] [default to '']
**content** | **string** | Base64 encoded content | [optional] [default to undefined]
**content_type** | **string** | MIME content type (required) | [default to '']
**inline_id** | **string** | Inline attachment ID | [optional] [default to '']

## Example

```typescript
import { Attachment } from '@goodsender/sdk';

const instance: Attachment = {
    file_name,
    content,
    content_type,
    inline_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
