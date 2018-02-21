# BETA Learnosity SDK - NodeJS

The package is currently in BETA and hasn't been fully tested for production use. Certain features found in the PHP SDK aren't fully supported.

Include this package into your own codebase to ease integration with any of the Learnosity APIs.

## Installation

### NPM

	npm install [--save|--save-dev] https://github.com/Learnosity/learnosity-sdk-nodejs

To install from [a tag](https://github.com/Learnosity/learnosity-sdk-nodejs/releases):

	npm install [--save|--save-dev] https://github.com/Learnosity/learnosity-sdk-nodejs#v0.4.1

### git clone

``` shell
git clone git@github.com:Learnosity/learnosity-sdk-nodejs.git
```

If you don't have an SSH key loaded into github you can clone via HTTPS (not recommended)

``` shell
git clone https://github.com/Learnosity/learnosity-sdk-nodejs.git
```

## Examples
You can find a complete site with examples of Learnosity APIs integration in our [demos site](http://demos.learnosity.com/).

You can download the entire site or browse the code directly on [github](https://github.com/Learnosity/learnosity-demos/).


## Usage

### Learnosity.init()


The init function is used to create the necessary *security* and *request* details used to integrate with a Learnosity API. Most often this will be a JavaScript object.

The init function takes up to 5 arguments:

 * [string]  service type
 * [array]   security details (**no secret**)
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

var Learnosity = require('learnosity-sdk-nodejs');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  var learnositySdk = new Learnosity();
  var request = learnositySdk.init(
   "questions",
   {
       "consumer_key": "yis0TYCu7U9V4o7M",
       "domain":       "localhost",
       "user_id":      "demo_student"
   },
   "74c5fd430cf1242a527f6223aebd42d30464be22",
   {
       "type":       "local_practice",
       "state":      "initial",
       "questions":  [
           {
               "response_id":         "60005",
               "type":                "association",
               "stimulus":            "Match the cities to the parent nation.",
               "stimulus_list":       ["London", "Dublin", "Paris", "Sydney"],
               "possible_responses":  ["Australia", "France", "Ireland", "England"],
               "validation": {
                   "score": 1,
                   "value": ["England", "Ireland", "France", "Australia"]
               }
           }
       ]
   }
  );

  res.render("index", { request: request } );
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
<head lang="en">
    <meta charset="UTF-8">
    <title>Learnosity SDK - NodeJS</title>
</head>
<body>
<span class="learnosity-response question-60005"></span>
<script src="//questions.learnosity.com/?v2"></script>
<script>
	var request = <%- JSON.stringify(request) %>
	console.log(request);
    var questionsApp = LearnosityApp.init(request);
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
    "learnosity-sdk-nodejs": "git+https://github.com/Learnosity/learnosity-sdk-nodejs.git#v0.4.1"
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
An array^ that includes your *consumer_key* but does not include your *secret*. The SDK sets defaults for you, but valid options are:

* consumer_key (mandatory)
* domain (mandatory)
* timestamp (optional - the SDK will generate this for you)
* user_id (optional - not necessary for all APIs)

^Note – the SDK accepts a JSON string and native javascript objects.

**secret**<br>
Your private key, as provided by Learnosity.

**request**<br>
An optional associative array^ of data relevant to the API being used. This will be any data minus the security details that you would normally use to initialise an API.

^Note – the SDK accepts a JSON string and normal Javascript objects.

**action**<br>
An optional string used only if integrating with the Data API. Valid options are:

* get
* set
* update
* delete