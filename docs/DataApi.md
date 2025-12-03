# Data API Routing Layer

The Node.js SDK now includes a routing layer for the Data API, making it easier to interact with Learnosity's Data API without manually handling HTTP requests and signatures.

## Features

- ✅ **Automatic request signing** - No need to manually sign requests
- ✅ **Built-in HTTP client** - Makes actual HTTP requests to Data API
- ✅ **Pagination support** - Automatically handles paginated responses
- ✅ **Iterator methods** - Easy iteration through pages and individual results
- ✅ **Routing metadata** - Automatically adds ALB routing headers
- ✅ **Custom HTTP adapter** - Use your own HTTP library (axios, node-fetch, etc.)

## Installation

The DataApi class is included with the SDK:

```javascript
const LearnositySDK = require('learnosity-sdk-nodejs');
const DataApi = LearnositySDK.DataApi;
```

Or import directly:

```javascript
const DataApi = require('learnosity-sdk-nodejs/lib/DataApi');
```

## Basic Usage

### Simple Request

```javascript
const DataApi = require('learnosity-sdk-nodejs/lib/DataApi');

const dataApi = new DataApi({
    consumerKey: 'your_consumer_key',
    consumerSecret: 'your_consumer_secret',
    domain: 'yourdomain.com'
});

// Make a request
const response = await dataApi.request(
    'https://data.learnosity.com/v2023.1.LTS/itembank/items',
    {
        consumer_key: 'your_consumer_key',
        domain: 'yourdomain.com'
    },
    'your_consumer_secret',
    {
        limit: 10,
        references: ['item_1', 'item_2']
    },
    'get'
);

const data = await response.json();
console.log(data);
```

### Paginated Requests

Automatically iterate through all pages:

```javascript
for await (const page of dataApi.requestIter(
    'https://data.learnosity.com/v2023.1.LTS/itembank/items',
    { consumer_key: 'xxx', domain: 'example.com' },
    'secret',
    { limit: 100 },
    'get'
)) {
    console.log(`Page has ${page.data.length} items`);
    console.log(`Total records: ${page.meta.records}`);
}
```

### Individual Results Iterator

Iterate through individual results across all pages:

```javascript
for await (const item of dataApi.resultsIter(
    'https://data.learnosity.com/v2023.1.LTS/itembank/items',
    { consumer_key: 'xxx', domain: 'example.com' },
    'secret',
    { limit: 100 },
    'get'
)) {
    console.log(`Item: ${item.reference}`);
}
```

## API Reference

### Constructor

```javascript
new DataApi(options)
```

**Options:**
- `consumerKey` (string, optional) - Your Learnosity consumer key
- `consumerSecret` (string, optional) - Your Learnosity consumer secret
- `domain` (string, optional) - Your domain for security packet
- `httpAdapter` (function, optional) - Custom HTTP adapter function

### Methods

#### `request(endpoint, securityPacket, secret, requestPacket, action)`

Makes a single HTTP request to the Data API.

**Parameters:**
- `endpoint` (string) - Full URL to the Data API endpoint
- `securityPacket` (object) - Security object with `consumer_key` and `domain`
- `secret` (string) - Consumer secret for signing
- `requestPacket` (object, optional) - Request parameters
- `action` (string, optional) - Action type: `'get'`, `'set'`, `'update'`, `'delete'` (default: `'get'`)

**Returns:** Promise<Response>

#### `requestIter(endpoint, securityPacket, secret, requestPacket, action)`

Async generator that yields pages of results, automatically handling pagination.

**Parameters:** Same as `request()`

**Yields:** Page objects with `meta` and `data` properties

#### `resultsIter(endpoint, securityPacket, secret, requestPacket, action)`

Async generator that yields individual results from the `data` array, automatically handling pagination.

**Parameters:** Same as `request()`

**Yields:** Individual result objects

## Advanced Usage

### Custom HTTP Adapter

Use your own HTTP library (e.g., axios):

```javascript
const axios = require('axios');

const dataApi = new DataApi({
    consumerKey: 'xxx',
    consumerSecret: 'secret',
    domain: 'example.com',
    httpAdapter: async (url, options) => {
        const response = await axios({
            method: options.method,
            url: url,
            headers: options.headers,
            data: options.body
        });
        
        return {
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText,
            json: async () => response.data,
            text: async () => JSON.stringify(response.data)
        };
    }
});
```

## Routing Metadata

The DataApi automatically adds routing metadata headers to all requests:

- `X-Learnosity-Consumer` - Consumer key
- `X-Learnosity-Action` - Derived action (e.g., `get_/itembank/items`)
- `X-Learnosity-SDK` - SDK version (e.g., `Node.js:0.6.2`)

These headers are used by Learnosity's Application Load Balancer for routing.

## Examples

See the [examples/data-api-example.js](../examples/data-api-example.js) file for complete working examples.

## Comparison with Python SDK

This implementation mirrors the Python SDK's DataApi class, providing:

- `request()` - Single request (Python: `request()`)
- `requestIter()` - Page iterator (Python: `request_iter()`)
- `resultsIter()` - Results iterator (Python: `results_iter()`)

