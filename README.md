<p align="center"><img width="50%" height="50%" src="docs/images/image-logo-graphic.png"></p>
<h1 align="center">Learnosity SDK - Node.js</h1>
<p align="center">Everything you need to start building your app in Learnosity, with Node.js and the JavaScript programming language.<br> 
(Prefer another language? <a href="https://help.learnosity.com/hc/en-us/sections/360000194318-Server-side-development-SDKs">Click here</a>)<br>
An official Learnosity open-source project.</p>

[![Latest Stable Version](https://img.shields.io/github/tag/Learnosity/learnosity-sdk-nodejs.svg?label=stable)](https://github.com/Learnosity/learnosity-sdk-nodejs/releases)
[![Build Status](https://app.travis-ci.com/Learnosity/learnosity-sdk-nodejs.svg?branch=master)](https://app.travis-ci.com/Learnosity/learnosity-sdk-nodejs)
[![License](docs/images/apache-license.svg)](LICENSE.md)
[![Downloads](docs/images/downloads.svg)](https://github.com/Learnosity/learnosity-sdk-nodejs/releases)
---

## Table of Contents

* [Overview: what does it do?](#overview-what-does-it-do)
* [Requirements](#requirements)
* [Installation](#installation)
* [Quick start guide](#quick-start-guide)
* [Next steps: additional documentation](#next-steps-additional-documentation)
* [Contributing to this project](#contributing-to-this-project)
* [License](#license)
* [Usage tracking](#usage-tracking)
* [Further reading](#further-reading)

## Overview: what does it do?
The Learnosity Node.js SDK makes it simple to interact with Learnosity APIs.

![image-concept-overview.png](docs/images/image-concept-overview.png)

It provides a number of convenience features for developers, that make it simple to do the following essential tasks:
* Creating signed security requests for API initialization, and
* Interacting with the Data API.

For example, the SDK helps with creating a signed request for Learnosity:

![image-signed-request-creation.png](docs/images/image-signed-request-creation.png)

Once the SDK has created the signed request for you, your app sends that on to an API in the Learnosity cloud, which then retrieves the assessment you are asking for, as seen in the diagram below:

![image-assessment-retrieval.png](docs/images/image-assessment-retrieval.png)

This scenario is what you can see running in the Quick start guide example ([see below](#quick-start-guide)).

There's more features, besides. See the detailed list of SDK features on the [reference page](REFERENCE.md).

[(Back to top)](#table-of-contents)

## Requirements
1. Runtime libraries for Node.js installed. ([instructions](https://nodejs.org/en/download/))

2. To follow the tutorial on this page, also install some other libraries: 
* [Express.js](http://expressjs.com/), a minimal web framework, 
* The [EJS](https://ejs.co/) templating language, and 
* The [UUID](https://www.npmjs.com/package/uuid) library. These are not actually a requirement of the SDK itself, so if your app doesn't use these libraries, no need to install them. They are only required for the tutorial on this page.

Not using Node.js? See the [SDKs for other languages](https://help.learnosity.com/hc/en-us/sections/360000194318-Server-side-development-SDKs).

### Supported Node.js Versions
The Learnosity SDK - Node.js is verified against [Active LTS and Maintenance LTS releases of Node.js](https://nodejs.org/en/about/releases/).

[(Back to top)](#table-of-contents)

## Installation
###  **Installation via NPM**
Using NPM is the recommended way to install the Learnosity SDK for Node.js in production. The easiest way is to run this from your parent project folder:

	npm install https://github.com/Learnosity/learnosity-sdk-nodejs

To follow the tutorial on this page, also install some other libraries: 
* [Express.js](http://expressjs.com/), a minimal web framework, 
* The [EJS](https://ejs.co/) templating language, and 
* The [UUID](https://www.npmjs.com/package/uuid) library.
Install these by running the following commands from the root folder of the project.

```
    npm install express
    npm install ejs
    npm install uuid
```

*Note*: these additional libraries are not required by the Learnosity SDK. They are only required for the tutorial on this page.

### **Alternative method 1: download the zip file**
Download the latest version of the SDK as a self-contained ZIP file from the [GitHub Releases](https://github.com/Learnosity/learnosity-sdk-nodejs/releases) page. The distribution ZIP file contains all the necessary dependencies. 

One downloaded, run this command from the root folder to install dependencies:

```
    npm install
```

To follow the tutorial on this page, also install some other libraries: 
* [Express.js](http://expressjs.com/), a minimal web framework, 
* The [EJS](https://ejs.co/) templating language, and 
* The [UUID](https://www.npmjs.com/package/uuid) library.
Install these by running the following commands from the root folder of the project.

```
    npm install express
    npm install ejs
    npm install uuid
```

*Note*: these additional libraries are not required by the Learnosity SDK. They are only required for the tutorial on this page.

### **Alternative method 2: development install from a git clone**
To install from the terminal, run this command:

    git clone git@github.com:Learnosity/learnosity-sdk-nodejs.git

To follow the tutorial on this page, also install some other libraries: 
* [Express.js](http://expressjs.com/), a minimal web framework, 
* The [EJS](https://ejs.co/) templating language, and 
* The [UUID](https://www.npmjs.com/package/uuid) library.
Install these by running the following commands from the root folder of the project.

```
    npm install express
    npm install ejs
    npm install uuid
```

*Note*: these additional libraries are not required by the Learnosity SDK. They are only required for the tutorial on this page.

Note that these manual installation methods are for development and testing only.
For production use, you should install the SDK using the NPM package manager for Node.js, as described above.

[(Back to top)](#table-of-contents)

## Quick start guide
Let's take a look at a simple example of the SDK in action. In this example, we'll load an assessment into the browser.

### **Start up your web server and view the standalone assessment example**
To start up your Node.js web server, first find the following folder location under the SDK. Change directory ('cd') to this location on the command line.

    .../learnosity-sdk-nodejs/docs/quickstart/assessment/

To start, run this command from that folder:

```
npm run start-standalone-assessment

```

From this point on, we'll assume that your web server is available at this local address (it will report the port being used when you launch it, by default it is port 3000): 

http://localhost:3000/

When you open this URL with your browser, the page will load. This is a basic example of an assessment loaded into a web page with Learnosity's assessment player. You can interact with this demo assessment to try out the various Question types.

<img width="50%" height="50%" src="docs/images/image-quickstart-examples-assessment.png">

[(Back to top)](#table-of-contents)

### **How it works**
Let's walk through the code for this standalone assessment example. The source file is included under the quickstart folder, in this location:

    .../learnosity-sdk-nodejs/docs/quickstart/assessment/standalone-assessment.js

The first section of code is JavaScript and is executed server-side. It constructs a set of configuration options for Items API, and securely signs them using the consumer key. The second section is HTML and JavaScript and is executed client-side, once the page is loaded in the browser. It renders and runs the assessment functionality.

[(Back to top)](#table-of-contents)

### **Server-side code**
We start by including the LearnositySDK constructor. This make it easy to generate and sign the config options.

``` javascript
const Learnosity = require('../../../index'); // Learnosity SDK constructor
```

Next, we declare the Learnosity consumer credentials we'll use to authorize this request. We also construct security settings that ensure the report is initialized on the intended domain. The value provided to the domain property must match the domain from which the file is actually served. The consumer key and consumer secret in this example are for Learnosity's public "demos" account (loaded from the [config.js](docs/quickstart/config.js) file). Once Learnosity provides your own consumer credentials, your Item bank and assessment data will be tied to your own consumer key and secret.

``` javascript
const config = require('../config'); // Load consumer key & secret
```

<i>(of course, you should never normally put passwords into version control)</i>

We bring in the UUID library.

``` javascript
const uuid = require('uuid');  // Load the UUID library
```

We also specify a few libraries to run a minimal web server, "Express.js" for the purposes of this example.

``` javascript
const express = require('express'); // Load Express.js web server 
var app = express();                // Instantiate the web server
```

We also choose EJS as the view engine, 

``` javascript
app.set('view engine', 'ejs'); // Set EJS as the templating language
```

Now we set up the user_id, session_id (both UUID values), and domain configuration.

``` javascript
const user_id = uuid.v4();    // Generate a UUID for the user ID
const session_id = uuid.v4(); // Generate a UUID for the session ID
const domain = 'localhost';   // Set the domain
```

Now we'll declare the Learnosity configuration options for Items API. These specify which assessment content should be rendered, how it should be displayed, which user is taking this assessment and how their responses should be stored. 

``` javascript
app.get('/', function (req, res) { 
    const learnositySdk = new Learnosity(); // Instantiate the SDK
    const request = learnositySdk.init(  // Set Learnosity init options
        'items',                              // Select Items API
        {
            consumer_key: config.consumerKey,
            domain: 'localhost',
        },
        config.consumerSecret,
        {
            user_id: user_id,
            activity_template_id: 'quickstart_examples_activity_template_001',
            session_id: session_id,
            activity_id: "quickstart_examples_activity_001",
            rendering_type: 'assess',
            type: 'submit_practice',
            name: "Items API Quickstart",
            state: 'initial',
            config: {
                regions: 'main'
            }
        }
    );
```

* `user_id`: unique student identifier. Note: we never send or save student's names or other personally identifiable information in these requests. The unique identifier should be used to look up the entry in a database of students accessible within your system only. [Learn more](https://help.learnosity.com/hc/en-us/articles/360002309578-Student-Privacy-and-Personally-Identifiable-Information-PII-).
* `activity_template_id`: reference of the Activity to retrieve from the Item bank. The Activity defines which Items will be served in this assessment.
* `session_id`: uniquely identifies this specific assessment attempt for save/resume, data retrieval and reporting purposes. Here, we're using the `Uuid` helper to auto-generate a unique session id.
* `activity_id`: a string you define, used solely for analytics to allow you run reporting and compare results of users submitting the same assessment.
* `rendering_type`: selects a rendering mode, `assess` mode is a "standalone" mode (loading a complete assessment player for navigation, as opposed to `inline` for embedding without).
* `type`: selects the context for the student response storage. `submit_practice` mode means the student responses will be stored in the Learnosity cloud, allowing for grading and review.
* `name`: human-friendly display name to be shown in reporting, via Reports API and Data API.
* `state`: Optional. Can be set to `initial`, `resume` or `review`. `initial` is the default.

**Note**: you can submit the configuration options either as an array as shown above, or a JSON string.

In the example above, we're calling LearnositySDK's `init()` constructor to construct our Items API configuration parameters, and signing them securely.

[(Back to top)](#table-of-contents)

### **Web page content**
We've got our set of signed configuration parameters, so now we can set up our page content for output. The page can be as simple or as complex as needed, using your own HTML, JavaScript and your frameworks of choice to render the desired product experience.

This example uses HTML in an EJS template, served by the Express.js web server. However, the template used here can be easily modified for use in another framework.

The following example HTML template can be found in the [standalone-assessment.ejs](docs/quickstart/views/standalone-assessment.ejs) file.

``` html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Learnosity SDK - NodeJS</title>
    <script src="//items.learnosity.com/?latest-lts"></script>
</head>
<body>
    <h1>Standalone Assessment Example</h1>
<div id="learnosity_assess"></div>
<script>
    const request = <%- JSON.stringify(request) %>;
    const itemsApp = LearnosityItems.init(request, {
        readyListener() {
            console.log('ready');
        },
        errorListener(err) {
            console.log('error', err);
        }
    })
</script>
</body>
</html>
```

The important parts to be aware of in this HTML are:

* A div with `id="learnosity_assess"`. This is where the Learnosity assessment player will be rendered to deliver the assessment.
* The `<script src="https://items.learnosity.com/?latest-lts"></script>` tag, which includes Learnosity's Items API on the page and makes the global `LearnosityItems` object available. The version specified as `latest-lts` will retrieve the latest version supported. To know more about switching to a specific LTS version, visit our [Long Term Support (LTS) page](https://help.learnosity.com/hc/en-us/articles/360001268538-Release-Cadence-and-Version-Lifecycle). In production, you should always pin to a specific LTS version to ensure version compatibility.
* The call to `LearnosityItems.init()`, which initiates Items API to inject the assessment player into the page.
* The variable `request` dynamically sends the contents of our init options (Learnosity configuration) to JavaScript in the browser, so it can be passed to `init()`.

This marks the end of the quick start guide. From here, try modifying the example files yourself, you are welcome to use this code as a basis for your own projects. As mentioned earlier, the EJS template used here can be easily re-used in another framework.

Take a look at some more in-depth options and tutorials on using Learnosity assessment functionality below.

[(Back to top)](#table-of-contents)

## Next steps: additional documentation

### **SDK reference**
See a more detailed breakdown of all the SDK features, and examples of how to use more advanced or specialised features on the [SDK reference page](REFERENCE.md).

### **Additional quick start guides**
There are more quick start guides, going beyond the initial quick start topic of loading an assessment, these further tutorials show how to set up authoring and analytics:
* [Authoring Items quick start guide](https://help.learnosity.com/hc/en-us/articles/360000754958-Getting-Started-With-the-Author-API) (Author API) - create and edit new Questions and Items for your Item bank, then group your assessment Items into Activities, and
* [Analytics / student reporting quick start guide](https://help.learnosity.com/hc/en-us/articles/360000755838-Getting-Started-With-the-Reports-API) (Reports API) - view the results and scores from an assessment Activity. 

### **Learnosity demos repository**
On our [demo site](https://demos.learnosity.com/), browse through many examples of Learnosity API integration. You can also download the entire demo site source code, the code for any single demo, or browse the codebase directly on GitHub.

### **Learnosity reference documentation**
See full documentation for Learnosity API init options, methods and events in the [Learnosity reference site](https://reference.learnosity.com/).

### **Technical use-cases documentation**
Find guidance on how to select a development pattern and arrange the architecture of your application with Learnosity, in the [Technical Use-Cases Overview](https://help.learnosity.com/hc/en-us/articles/360000757777-Technical-Use-Cases-Overview).

### **Deciding what to build or integrate**
Get help deciding what application functionality to build yourself, or integrate off-the-shelf with the [Learnosity "Golden Path" documentation](https://help.learnosity.com/hc/en-us/articles/360000754578-Recommended-Deployment-Patterns-Golden-Path-).

### **Key Learnosity concepts**
Want more general information about how apps on Learnosity actually work? Take a look at our [Key Learnosity Concepts page](https://help.learnosity.com/hc/en-us/articles/360000754638-Key-Learnosity-Concepts).

### **Glossary**
Need an explanation for the unique Learnosity meanings for Item, Activity and Item bank? See our [Glossary of Learnosity-specific terms](https://help.learnosity.com/hc/en-us/articles/360000754838-Glossary-of-Learnosity-and-Industry-Terms).

[(Back to top)](#table-of-contents)

## Contributing to this project

### Adding new features or fixing bugs
Contributions are welcome. See the [contributing instructions](CONTRIBUTING.md) page for more information. You can also get in touch via our support team.

[(Back to top)](#table-of-contents)

## License
The Learnosity Node.js SDK is licensed under an Apache 2.0 license. [Read more](LICENSE.md).

[(Back to top)](#table-of-contents)

## Usage tracking
Our SDKs include code to track the following information by adding it to the request being signed:
- SDK version
- SDK language
- SDK language version
- Host platform (OS)
- Platform version

We use this data to enable better support and feature planning.

[(Back to top)](#table-of-contents)

## Further reading
Thanks for reading to the end! Find more information about developing an app with Learnosity on our documentation sites: 

* [help.learnosity.com](http://help.learnosity.com/hc/en-us) -- general help portal and tutorials,
* [reference.learnosity.com](http://reference.learnosity.com) -- developer reference site, and
* [authorguide.learnosity.com](http://authorguide.learnosity.com) -- authoring documentation for content creators.

[(Back to top)](#table-of-contents)
