# Learnosity SDK - NodeJS

Include this package into your own codebase to ease integration with any of the Learnosity APIs.

## Installation

### NPM

Installation via NPM is comming soon

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

``` javascript
var Learnosity = require('learnosity-sdk-nodejs');

// Instantiate the SDK Init class with your security and request data:
var request = Learnosity.init(
   'questions',
   {
       'consumer_key': 'yis0TYCu7U9V4o7M',
       'domain':       'localhost',
       'user_id':      'demo_student'
   },
   'superfragilisticexpialidocious',
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
                   'valid_responses': {
                       ['England'], ['Ireland'], ['France'], ['Australia']
                   }
               }
           }
       ]
   }
);

```

``` html
// Pass the object to the initialisation of any Learnosity API, in this example the Questions API
<script src="//questions.learnosity.com"></script>
<script>
    var questionsApp = LearnosityApp.init( {{ JSON.encode(request) }} );
</script>
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

* consumer_key
* domain (optional - defaults to *localhost*)
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
