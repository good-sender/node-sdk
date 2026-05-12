# EmailsApi

All URIs are relative to *https://api.goodsender.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getEmailConsentStatus**](#getemailconsentstatus) | **GET** /v1/emails/{email} | Get recipient consent status|
|[**listEmailConsents**](#listemailconsents) | **GET** /v1/emails | List email consent statuses|
|[**requestEmailConsent**](#requestemailconsent) | **POST** /v1/emails/consent | Request recipients\&#39; consent to receive emails from your domain|
|[**sendEmail**](#sendemail) | **POST** /v1/emails/send | Send an email or a batch of emails|
|[**sendTemplateEmail**](#sendtemplateemail) | **POST** /v1/emails/template | Send a transactional email using a template|

# **getEmailConsentStatus**
> Array<EmailAccount> getEmailConsentStatus()

Retrieve the current consent status for an email address. Optionally filter by sender domain.

### Example

```typescript
import {
    EmailsApi,
    Configuration
} from '@goodsender/sdk';

const configuration = new Configuration();
const apiInstance = new EmailsApi(configuration);

let email: string; //Email address to look up. (default to undefined)
let domain: string; //Optional sender domain to filter consent records by. When omitted, returns consent across all domains. (optional) (default to undefined)

const { status, data } = await apiInstance.getEmailConsentStatus(
    email,
    domain
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **email** | [**string**] | Email address to look up. | defaults to undefined|
| **domain** | [**string**] | Optional sender domain to filter consent records by. When omitted, returns consent across all domains. | (optional) defaults to undefined|


### Return type

**Array<EmailAccount>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Recipient consent status across all domains |  -  |
|**400** | Invalid email address |  -  |
|**404** | Email address was not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listEmailConsents**
> EmailListResponse listEmailConsents()

Retrieve a paginated list of email consent statuses for a domain.

### Example

```typescript
import {
    EmailsApi,
    Configuration
} from '@goodsender/sdk';

const configuration = new Configuration();
const apiInstance = new EmailsApi(configuration);

let domain: string; //Sender domain to filter consent records by. (default to undefined)
let limit: number; //Maximum number of records to return. (optional) (default to 50)
let cursor: string; //Cursor for pagination. (optional) (default to undefined)
let consentStatus: 'pending' | 'requested' | 'failed' | 'granted' | 'denied'; //Status of the recipient\'s consent for receiving emails. \'pending\' = awaiting consent email send, \'requested\' = consent email dispatched, \'failed\' = consent email delivery failed, \'granted\' = recipient consented to receive emails, \'denied\' = recipient declined to receive emails. (optional) (default to undefined)
let engagementStatus: 'new' | 'hot' | 'warm' | 'cooling' | 'dormant' | 'inactive'; //Status of the recipient\'s engagement with the emails. (optional) (default to undefined)

const { status, data } = await apiInstance.listEmailConsents(
    domain,
    limit,
    cursor,
    consentStatus,
    engagementStatus
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **domain** | [**string**] | Sender domain to filter consent records by. | defaults to undefined|
| **limit** | [**number**] | Maximum number of records to return. | (optional) defaults to 50|
| **cursor** | [**string**] | Cursor for pagination. | (optional) defaults to undefined|
| **consentStatus** | [**&#39;pending&#39; | &#39;requested&#39; | &#39;failed&#39; | &#39;granted&#39; | &#39;denied&#39;**]**Array<&#39;pending&#39; &#124; &#39;requested&#39; &#124; &#39;failed&#39; &#124; &#39;granted&#39; &#124; &#39;denied&#39;>** | Status of the recipient\&#39;s consent for receiving emails. \&#39;pending\&#39; &#x3D; awaiting consent email send, \&#39;requested\&#39; &#x3D; consent email dispatched, \&#39;failed\&#39; &#x3D; consent email delivery failed, \&#39;granted\&#39; &#x3D; recipient consented to receive emails, \&#39;denied\&#39; &#x3D; recipient declined to receive emails. | (optional) defaults to undefined|
| **engagementStatus** | [**&#39;new&#39; | &#39;hot&#39; | &#39;warm&#39; | &#39;cooling&#39; | &#39;dormant&#39; | &#39;inactive&#39;**]**Array<&#39;new&#39; &#124; &#39;hot&#39; &#124; &#39;warm&#39; &#124; &#39;cooling&#39; &#124; &#39;dormant&#39; &#124; &#39;inactive&#39;>** | Status of the recipient\&#39;s engagement with the emails. | (optional) defaults to undefined|


### Return type

**EmailListResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A paginated list of email consent statuses |  -  |
|**400** | Invalid request parameters |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **requestEmailConsent**
> ConsentEmailResult requestEmailConsent(consentEmailRequest)

Send a consent message to each address so recipients can approve or reject future emails from your domain. Include the email addresses in the request body to start the consent flow. 

### Example

```typescript
import {
    EmailsApi,
    Configuration,
    ConsentEmailRequest
} from '@goodsender/sdk';

const configuration = new Configuration();
const apiInstance = new EmailsApi(configuration);

let consentEmailRequest: ConsentEmailRequest; //

const { status, data } = await apiInstance.requestEmailConsent(
    consentEmailRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **consentEmailRequest** | **ConsentEmailRequest**|  | |


### Return type

**ConsentEmailResult**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Recipient consent status for each address (found or created) |  -  |
|**400** | Invalid request |  -  |
|**429** | Too many consents are awaiting processing for this workspace. The internal release queue will drain pending entries automatically; retry later.  |  -  |
|**500** | Internal server error. The upfront quota reservation (if any) is refunded and the request is safe to retry — &#x60;getOrCreateEmailsInDb&#x60; is idempotent.  |  -  |
|**502** | Bad gateway - upstream email service unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sendEmail**
> SendEmailResponse sendEmail(sendEmailRequest)

Send one or more emails. Emails can be sent only to recipients who have opted in to receive communications from your domain. The response indicates how many emails were sent versus not sent, based on each recipient\'s consent state. 

### Example

```typescript
import {
    EmailsApi,
    Configuration,
    SendEmailRequest
} from '@goodsender/sdk';

const configuration = new Configuration();
const apiInstance = new EmailsApi(configuration);

let sendEmailRequest: SendEmailRequest; //List of emails to send

const { status, data } = await apiInstance.sendEmail(
    sendEmailRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sendEmailRequest** | **SendEmailRequest**| List of emails to send | |


### Return type

**SendEmailResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Email(s) accepted for sending |  -  |
|**400** | Bad request - validation error |  -  |
|**401** | Unauthorized - invalid or missing API key |  -  |
|**413** | Payload too large |  -  |
|**429** | Quota exceeded. |  * Retry-After - Seconds until the quota resets. <br>  |
|**500** | Internal server error |  -  |
|**502** | Bad gateway - upstream email service unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sendTemplateEmail**
> TemplateEmailResponse sendTemplateEmail(templateEmailRequest)

Send a transactional email using a predefined template for common use cases like OTP codes, order confirmations, and new device login alerts. If the recipient has \"denied\" consent, the response returns `{\"status\": \"declined\"}` and the email is not sent. Unknown recipients are auto-registered with \"pending\" consent. The template endpoint does not change the recipient\'s consent. Each email includes an approve/reject footer allowing the recipient to manage future communications. Provide the template ID and any variables to fill in the placeholders. All variables are optional and will be replaced with an empty string if omitted. URL-type variables must point to the same domain as the sender\'s email address. 

### Example

```typescript
import {
    EmailsApi,
    Configuration,
    TemplateEmailRequest
} from '@goodsender/sdk';

const configuration = new Configuration();
const apiInstance = new EmailsApi(configuration);

let templateEmailRequest: TemplateEmailRequest; //Template email to send

const { status, data } = await apiInstance.sendTemplateEmail(
    templateEmailRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **templateEmailRequest** | **TemplateEmailRequest**| Template email to send | |


### Return type

**TemplateEmailResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Whether the templated email was sent |  -  |
|**400** | Bad request - invalid variables or request body |  -  |
|**401** | Unauthorized - invalid or missing API key |  -  |
|**404** | Template not found |  -  |
|**413** | Payload too large |  -  |
|**429** | Quota exceeded. |  * Retry-After - Seconds until the quota resets. <br>  |
|**500** | Internal server error |  -  |
|**502** | Bad gateway - upstream email service unavailable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

