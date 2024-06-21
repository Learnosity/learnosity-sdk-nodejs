'use strict';

// Include server-side Learnosity SDK and other dependencies
const Learnosity = require('../../../index'); // Include Learnosity SDK constructor
const config = require('../config'); // Load consumer key & secret from config.js
const express = require('express'); // Load Express.js, a web server
const app = express(); // Instantiate the web server

// Set EJS as our templating language
app.set('view engine', 'ejs');

// Set the web server domain
const domain = 'localhost';

// Define the main route
app.get('/', function (req, res) {
    const learnositySdk = new Learnosity(); // Instantiate the SDK

    // Learnosity API configuration parameters
    const request = learnositySdk.init(
        'authoraide', // Select Author API
        {
            consumer_key: config.consumerKey, // Load consumer key from config.js
            domain: domain // Set the domain
        },
        config.consumerSecret, // Load consumer secret from config.js
        {
            user: {
                id: 'demos-site',
                firstname: 'Demos',
                lastname: 'User',
                email: 'demos@learnosity.com'
            }
        }
    );

    // Render the page with the request object
    res.render('main', { request });
});

// Start the web server and listen on port 3000
app.listen(3000, function () {
    console.log('Example AuthorAide app listening on port 3000!');
});
