// Copyright (c) 2021 Learnosity, Apache 2.0 License
//
// Basic example of loading a standalone assessment in a web page using Items API
// with `rendering_type: "assess"`.
'use strict';

// Include server side Learnosity SDK, and set up variables related to user access.
const Learnosity = require('../../../index'); // Include Learnosity SDK constructor
const config = require('../config'); // Load consumer key & secret from config.js
const express = require('express');  // Load 'Express.js", a web server
const app = express();               // Instantiate the web server

app.set('view engine', 'ejs');       // Set EJS as our templating language

// - - - - - - Learnosity server-side configuration - - - - - - //

// Set the web server domain.

const domain = 'localhost';

app.get('/', function (req, res) {
    const learnositySdk = new Learnosity(); // Instantiate the SDK
    // Reports API configuration parameters.
    const request = learnositySdk.init(
        'reports',                              // Select Reports API
        // Consumer key and consumer secret are the public & private security keys required to access Learnosity APIs and data. These keys grant access to Learnosity's public demos account. Learnosity will provide keys for your own account.
        {
            consumer_key: config.consumerKey, // Load key from config.js
            domain: domain                   // Set the domain (from line 20)
        },
        config.consumerSecret,                // Load secret from config.js
        {
            // Reports array to specify the type(s) of the reports to load on the page. This example uses one report type for simplicity, but you can specify multiple report types.
            reports: [
                {
                    // type of the report you would like to request
                    type: 'session-detail-by-item',
                    // the id for the report which will match that of the html div element hook we want the report to render into
                    // (this div can be found on line 11 of docs/quickstart/views/reports.ejs)
                    id: 'session-detail',
                    // The unique student identifier that was generated for the student at the time of the assessment
                    user_id: '$ANONYMIZED_USER_ID',
                    // session id of the assessment session we wish to report on. This one uses the id a completed session from our Demos.
                    session_id: '8c393c87-77b6-4c14-8da7-75d39243e642'
                }
            ]
        }
    );

    res.render('reports', { request }); // Render the page and request.
});

app.listen(3000, function () { // Run the web application. Set the port here (3000).
    console.log('Example app listening on port 3000!');
});

// Note: for further reading, the client-side web page configuration can be found in the EJS template: 'docs/quickstart/views/reports.ejs'. //
