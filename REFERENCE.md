# Learnosity Node.js-SDK: Reference guide

## Usage

### Learnosity.init()

The init function is used to create the necessary *security* and *request* details used to integrate with a Learnosity API. Most often this will be a JavaScript object.

The init function takes up to 5 arguments:

 * [string]  service type
 * [object]  security details (**no secret**)
 * [string]  secret
 * [request] request details *(optional)*
 * [string]  action *(optional)*

## Items API Example

```
Structure of Node.js project (based on Express.js and EJS template):
- node_modules
----- ejs
----- express
----- learnosity-sdk-nodejs
----- (all standard modules)
- views
----- index.ejs
- package.json
- package-lock.json
- app.js
```

``` javascript
app.js:

const uuid = require('uuid');
const user_id = uuid.v4();
const Learnosity = require('learnosity-sdk-nodejs');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    const learnositySdk = new Learnosity();
    const request = learnositySdk.init(
        // service type
        'questions',

        // security details
        {
            'consumer_key': 'yis0TYCu7U9V4o7M',
            'domain':       'localhost',
            'user_id':      user_id
        },

        // secret
        '74c5fd430cf1242a527f6223aebd42d30464be22',

        // request details
        {
            'type':       'local_practice',
            'state':      'initial',
            'questions':  [
                {
                    'response_id':         '60005',
                    'type':                'association',
                    'stimulus':            'Match the cities to the parent nation.',
                    'stimulus_list':       ['London', 'Dublin', 'Paris', 'Sydney'],
                    'possible_responses':  ['Australia', 'France', 'Ireland', 'England'],
                    'validation': {
                    'score': 1,
                        'value': ['England', 'Ireland', 'France', 'Australia']
                    }
                }
            ]
        }
    );

    res.render('index', { request: request } );
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
```

``` html
index.ejs:

// Pass the object to the initialisation of any Learnosity API, in this example the Questions API
<!DOCTYPE html>
<html>
<head lang='en'>
    <meta charset='UTF-8'>
    <title>Learnosity SDK - NodeJS</title>
</head>
<body>
<span class='learnosity-response question-60005'></span>
<script src='//questions.learnosity.com/?v2'></script>
<script>
	const request = <%- JSON.stringify(request) %>
	console.log(request);
    const questionsApp = LearnosityApp.init(request);
</script>
</body>
</html>
```

``` json
package.json:

{
  "name": "nodeapp",
  "version": "1.0.0",
  "description": "Test NodeJS sdk",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "ejs": "^2.5.7",
    "express": "^4.16.2",
    "learnosity-sdk-nodejs": "git+https://github.com/Learnosity/learnosity-sdk-nodejs.git#v0.5.1"
  }
}
```

```
run node.js application: node app.js
check browser: http://localhost:3000/
```

## Data API - Example 1

 ``` javascript
 app.js:

// Vanilla node.js example with no dependencies required.
const Learnosity = require('learnosity-sdk-nodejs');

/*
 * NOTE: 
 * For this example native node Fetch API (still experimental) needs to be 
 * enabled, and then the following global functions and classes are made 
 * available: fetch(), Request, Response, Headers, FormData.
 * To enable Fetch in node you should use v18 or greater.
 * Run 'node --experimental-fetch' or 
 * 'node <FILENAME.js> --experimental-fetch' in the terminal to enable
 */

// Instantiate the SDK
const learnositySdk = new Learnosity();
// Generate a Learnosity API initialization packet to the Data API
const dataAPIRequest = learnositySdk.init(
    // Set the service type
    'data',

    // Security details - dataAPIRequest.security 
    {
        consumer_key: 'yis0TYCu7U9V4o7M', // Your actual consumer key goes here 
        domain:       'localhost', // Your actual domain goes here
        user_id:      '23452345' // Your user id goes here
    },
    // secret 
    '74c5fd430cf1242a527f6223aebd42d30464be22', // Your actual consumer secret here
    /* Request details - build your request object for the Data API here - 
    dataAPIRequest.request 
    This example fetches activities from our demos Item bank w/ the following references: */
    {
        references : ["19935",
        "00082a84-0a72-45bf-b465-e9e54b6094bc",
        "7656ffc0-2cad-4cf0-884f-946cbb9a4bad"]
    },
     // Action type - dataAPIRequest.action
     'get'
);

const form = new FormData();
/* Note: the same can be accomplished with using URLSearchParams 
(https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
 const form = new URLSearchParams()
*/
form.append("security", dataAPIRequest.security);
form.append("request", dataAPIRequest.request);
form.append("action", dataAPIRequest.action);

/* Define an async/await data api call function that takes in the following:
*
* @param endpoint : string
* @param requestParams : object
*
*/
const makeDataAPICall = async (endpoint, requestParams) => {
    // Use 'await' save the successful response to a variable called dataAPIResponse
    const dataAPIResponse = await fetch(endpoint, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      body: requestParams 
    });
    // Return the response JSON
    return dataAPIResponse.json(); 
}

/* Now call the function, passing in the desired endpoint (itembank/activities in this case), and pass in the fromData object (saved to the variable called 'form' here), which contains the requestParams: */

 makeDataAPICall('https://data.learnosity.com/v2022.1.LTS/itembank/activities', form)
   .then(response => {
    console.log("response from the data API", JSON.stringify(response, null, '\t'))
   })
   .catch(error => console.log('there was an error', error))
```

```
run node.js application: node app.js
check the terminal for the DataAPI response.
```

## Data API - Example 2, integration with Express.js

```
Structure of Node.js project (based on Express.js, Axios, and FormData):
- node_modules
----- express
----- axios
----- from-data
----- learnosity-sdk-nodejs
----- (all standard modules)
- package.json
- package-lock.json
- app.js
```

 ``` javascript
 app.js:

// Require Learnosity SDK:
const Learnosity = require('learnosity-sdk-nodejs');
// Three other required dependencies for this example: (express, form-data, axios):
const express = require('express');
const FormData = require('form-data')
const axios = require('axios');

const app = express();

/* Setting up a DATA API route using axios and express. Initialize a get express route (to reflect that the action is 'get'). You can call this route anything you want - called learnosity-activities here to reflect that you want to get your Activities from Learnosity.Use async await to await the response from the request to Learnosity. */
app.get('/learnosity-activities', async (req, res) => {
    // Instantiate the SDK
    const learnositySdk = new Learnosity();
    // Generate a Learnosity API initialization packet to the DataAPI
    const dataAPIRequest = learnositySdk.init(
        // Set the service type
        'data',

        // Security details - dataAPIRequest.security 
        {
            'consumer_key': 'yis0TYCu7U9V4o7M', // Your actual consumer key 
            'domain':       'localhost', // Your actual domain
            'user_id':      '1234567' // User ID
        },
        // Your actual consumer secret (note, this is the demo consumer)
        '74c5fd430cf1242a527f6223aebd42d30464be22',
        /* Request details - build your request object for the Data API here - dataAPIRequest.request. This example fetches Activities from our demos Item bank with the following references: */
        {
            references : ["19935",
            "00082a84-0a72-45bf-b465-e9e54b6094bc",
            "7656ffc0-2cad-4cf0-884f-946cbb9a4bad"]
        },
         // Action type - dataAPIRequest.action
         'get'
    );
    
    /* Use the form-data npm package to append the initilization packet 
    to the from object to be used in the axios request below. */
    const form = new FormData();
    /* Note: the same can be accomplished with using  URLSearchParams  
    (https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
     const form = newURLSearchParams()
    */
    form.append("security", dataAPIRequest.security);
    form.append("request", dataAPIRequest.request);
    form.append("action", dataAPIRequest.action);

    /* Now make a POST request to the desired endpoint of Data API.
    This example uses axios, and we include the form data in the POST request. */

    // Using 'await' to save the successful response to a variable called dataAPIResponse 
    const dataAPIResponse = await axios.post('https://data.learnosity.com/v2022.1.LTS/itembank/activities', form, {
    headers: form.getHeaders()
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    return res.data;
  })
  .catch(error => {
    console.log(error);
  })

  // Log the pretified response to the console using JSON.stringify
  console.log("response from the data API", JSON.stringify(dataAPIResponse, null, '\t'))
  // Send the response on using the express res.send() method
  res.send(dataAPIResponse)
});

// Generic message
app.get('/', (req,res) => {
  res.send("welcome to the NodeSDK + Express + DataAPI example. Go to /learnosity-activities to fetch the data")
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
```

``` json
package.json:

{
  "name": "nodesdk",
  "version": "1.0.0",
  "description": "Test Node JS SDK",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.27.2",
    "express": "^4.18.1",
    "form-data": "^4.0.0",
    "learnosity-sdk-nodejs": "github:Learnosity/learnosity-sdk-nodejs"
  }
}
```

```
run node.js application: node app.js
Check your browser or postman: http://localhost:3000/learnosity-activities to
see the Data API response.
```

#### Init() Arguments
**service**<br>
A string representing the Learnosity service (API) you want to integrate with. Valid options are:

* assess
* author
* data
* events
* items
* questions
* reports

**security**<br>
An object^ that includes your *consumer_key* but does not include your *secret*. The SDK sets defaults for you, but valid options are:

* consumer_key (mandatory)
* domain (mandatory)
* timestamp (optional - the SDK will generate this for you)
* user_id (optional - not necessary for all APIs)

^Note – the security parameter must be an object.

**secret**<br>
Your private key, as provided by Learnosity.

**request**<br>
Optional data relevant to the API being used. This will be any data minus the security details that you would normally use to initialize an API.

^Note – the SDK accepts a JSON string and normal JavaScript objects. Warning: if you provide an object to this parameter, the object will be modified. 

**action**<br>
An optional string used only if integrating with the Data API. Valid options are:

* get
* set
* update
* delete

**Note:** This SDK version only supports signing pre-written requests and does not provide any interface for sending the actual HTTP requests.

## Tracking
In version v0.5.0 we introduced code to track the following information by adding it to the request being signed:
- SDK version
- SDK language
- SDK language version
- Host platform (OS)
- Platform version

We use this data to enable better support and feature planning.

## Demos
You can find a complete site with examples of Learnosity integration in our [demo site](http://demos.learnosity.com/).

You can download the entire site or browse the code directly on [GitHub](https://github.com/Learnosity/learnosity-demos/).


## Further reading
Thanks for reading to the end! Find more information about developing an app with Learnosity on our documentation sites: 
<ul>
<li><a href="http://help.learnosity.com">help.learnosity.com</a> -- general help portal and tutorials,
<li><a href="http://reference.learnosity.com">reference.learnosity.com</a> -- developer reference site, and
<li><a href="http://authorguide.learnosity.com">authorguide.learnosity.com</a> -- authoring documentation for content creators.
</ul>

Back to [README.md](README.md)
