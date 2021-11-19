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
    "learnosity-sdk-nodejs": "git+https://github.com/Learnosity/learnosity-sdk-nodejs.git#v0.5.0"
  }
}
```

```
run node.js application: node app.js
check browser: http://localhost:3000/
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