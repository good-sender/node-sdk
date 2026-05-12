# SendEmail

Must provide valid sender and subject. At least one recipient (from \'to\', \'cc\', or \'bcc\') is required. Either \'text_content\', \'html_content\', \'markdown_content\', or \'template_id\' is required. When \'markdown_content\' is provided, \'text_content\' and \'html_content\' are ignored. 

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**from** | [**Address**](Address.md) | Sender address (required) | [default to undefined]
**to** | [**Array&lt;Address&gt;**](Address.md) | To recipients. At least one recipient (to, cc, or bcc) is required. Maximum 1000 recipients per email. | [default to undefined]
**subject** | **string** | The subject of the email (required) | [default to '']
**text_content** | **string** | Plain text content | [optional] [default to undefined]
**html_content** | **string** | HTML content | [optional] [default to undefined]
**markdown_content** | **string** | Markdown content. When provided, text_content and html_content are ignored. The raw markdown is used as text_content and rendered to HTML for html_content.  | [optional] [default to undefined]
**template_id** | **string** | Template ID for templated emails | [optional] [default to undefined]
**template_data** | **{ [key: string]: any; }** | Data to populate template variables | [optional] [default to undefined]
**attachments** | [**Array&lt;Attachment&gt;**](Attachment.md) | Email attachments | [optional] [default to undefined]
**headers** | **{ [key: string]: string; }** | Custom email headers | [optional] [default to undefined]
**reply_to** | [**Address**](Address.md) | Reply-to address | [optional] [default to undefined]
**send_time** | **number** | Unix timestamp for when to send the email. Must not be more than 72 hours in the future. If 0, sends immediately. | [optional] [default to undefined]
**webhook_data** | **{ [key: string]: string; }** | Custom data to include in webhook events. Maximum 10 keys, key length 50 chars, value length 100 chars. | [optional] [default to undefined]
**tag** | **string** | Custom tag for tracking. Maximum 100 characters. | [optional] [default to undefined]
**tracking** | [**TrackingSettings**](TrackingSettings.md) | Email tracking settings | [optional] [default to undefined]

## Example

```typescript
import { SendEmail } from '@goodsender/sdk';

const instance: SendEmail = {
    from,
    to,
    subject,
    text_content,
    html_content,
    markdown_content,
    template_id,
    template_data,
    attachments,
    headers,
    reply_to,
    send_time,
    webhook_data,
    tag,
    tracking,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
