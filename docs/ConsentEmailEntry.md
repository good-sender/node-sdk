# ConsentEmailEntry

Single entry in the `emails` array of a consent request. Either a bare email string (back-compat) or a `{ email, name? }` object so callers can attach a display name to a specific recipient. 

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** | Recipient email address. Leading and trailing whitespace are stripped server-side. | [default to undefined]
**name** | **string** | Optional display name. Pass a non-empty string to set or replace the stored name. Passing &#x60;null&#x60;, an empty string, or omitting the field on a re-submitted recipient leaves any previously-stored name unchanged — clearing must be done via the dashboard / authenticated edit flow.  | [optional] [default to undefined]

## Example

```typescript
import { ConsentEmailEntry } from '@goodsender/sdk';

const instance: ConsentEmailEntry = {
    email,
    name,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
