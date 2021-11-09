// Copyright (c) 2021 Learnosity, MIT License
//
// Basic example of embedding a standalone assessment using Items API
// with `rendering_type: "assess"`.

// Include server side Learnosity SDK, and set up variables related to user access.
const Learnosity = require('../../../index'); // Include Learnosity SDK helper
const config = require('../config'); // Load consumer key & secret from config.js
const express = require('express');  // Load 'Express.js", a web server 
const app = express();               // Instantiate the web server
app.set('view engine', 'ejs');       // Set EJS as our templating language
const uuid = require('uuid');        // Load the UUID library

// - - - - - - Section 1: Learnosity server-side configuration - - - - - - //

// Generate the user ID and session ID as UUIDs, set the web server domain.
user_id = uuid.v4();
session_id = uuid.v4();
domain = 'localhost';

app.get('/', function (req, res) {
    const learnositySdk = new Learnosity();
    const request = learnositySdk.init(
        'items',
        {
            consumer_key: config.consumerKey,
            domain: domain,
        },
        config.consumerSecret,
        {
            type: 'local_practice',
            state: 'initial',
            activity_id: 'demo_3',
            rendering_type: 'assess',
            session_id: session_id,
            items: ['Demo3', 'Demo4'],
            user_id: user_id,
            config: {
                regions: 'main'
            }
        }
    );

    res.render('standalone-assessment', { request });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});