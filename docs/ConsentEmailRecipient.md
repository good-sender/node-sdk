# ConsentEmailRecipient

Recipient envelope with optional display name. Pass this shape instead of a bare email string when you want the name to appear in the To header on the consent email and in subsequent listings.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** | Recipient email address. Leading and trailing whitespace are stripped server-side. | [default to undefined]
**name** | **string** | Optional display name. Pass a non-empty string to set or replace the stored name. Passing &#x60;null&#x60;, an empty string, or omitting the field on a re-submitted recipient leaves any previously-stored name unchanged — clearing must be done via the dashboard / authenticated edit flow.  | [optional] [default to undefined]

## Example

```typescript
import { ConsentEmailRecipient } from '@goodsender/sdk';

const instance: ConsentEmailRecipient = {
    email,
    name,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
