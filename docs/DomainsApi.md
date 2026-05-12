# DomainsApi

All URIs are relative to *https://api.goodsender.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**listDomains**](#listdomains) | **GET** /v1/domains | List domains|

# **listDomains**
> DomainListResponse listDomains()

Retrieve a paginated list of sender domains for the workspace the API key belongs to. Each entry includes the domain\'s verification state so callers can detect when DNS records still need attention. 

### Example

```typescript
import {
    DomainsApi,
    Configuration
} from '@goodsender/sdk';

const configuration = new Configuration();
const apiInstance = new DomainsApi(configuration);

let limit: number; //Maximum number of records to return. (optional) (default to 50)
let cursor: string; //Cursor for pagination, returned as `nextCursor` from a previous response. (optional) (default to undefined)

const { status, data } = await apiInstance.listDomains(
    limit,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] | Maximum number of records to return. | (optional) defaults to 50|
| **cursor** | [**string**] | Cursor for pagination, returned as &#x60;nextCursor&#x60; from a previous response. | (optional) defaults to undefined|


### Return type

**DomainListResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A paginated list of domains for the workspace. |  -  |
|**400** | Invalid request parameters. |  -  |
|**401** | Unauthorized - invalid or missing API key. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

