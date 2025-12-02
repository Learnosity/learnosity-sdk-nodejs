// Copyright (c) 2024 Learnosity, Apache 2.0 License
//
// Unified quickstart server with all API examples
'use strict';

const Learnosity = require('../../index');
const DataApi = require('../../lib/DataApi');
const config = require('./config');
const uuid = require('uuid');
const express = require('express');
const packageJson = require('../../package.json');
const app = express();
const port = 8000;
const domain = 'localhost';

app.set('view engine', 'ejs');

// Serve static CSS files
app.use('/css', express.static('./css'));

// Home page - list all examples
app.get('/', function (req, res) {
    res.render('index', {
        name: 'Learnosity SDK Quickstart Examples'
    });
});

// Items API - Standalone Assessment
app.get('/itemsapi', function (req, res) {
    const learnositySdk = new Learnosity();
    const user_id = uuid.v4();
    const session_id = uuid.v4();

    const request = learnositySdk.init(
        'items',
        {
            consumer_key: config.consumerKey,
            domain: domain
        },
        config.consumerSecret,
        {
            user_id: user_id,
            activity_template_id: 'quickstart_examples_activity_template_001',
            session_id: session_id,
            activity_id: 'quickstart_examples_activity_001',
            rendering_type: 'assess',
            type: 'submit_practice',
            name: 'Items API Quickstart',
            state: 'initial'
        }
    );

    res.render('standalone-assessment', { request });
});

// Questions API
app.get('/questionsapi', function (req, res) {
    const learnositySdk = new Learnosity();

    const request = learnositySdk.init(
        'questions',
        {
            consumer_key: config.consumerKey,
            domain: domain
        },
        config.consumerSecret,
        {
            type: 'local_practice',
            state: 'initial',
            questions: [
                {
                    response_id: '60005',
                    type: 'association',
                    stimulus: 'Match the cities to the parent nation.',
                    stimulus_list: ['London', 'Dublin', 'Paris', 'Sydney'],
                    possible_responses: ['Australia', 'France', 'Ireland', 'England'],
                    validation: {
                        valid_responses: [
                            ['England'], ['Ireland'], ['France'], ['Australia']
                        ]
                    }
                }
            ]
        }
    );

    res.render('questions', { request });
});

// Author API - Item List
app.get('/authorapi', function (req, res) {
    const learnositySdk = new Learnosity();

    const request = learnositySdk.init(
        'author',
        {
            consumer_key: config.consumerKey,
            domain: domain
        },
        config.consumerSecret,
        {
            mode: 'item_list',
            config: {
                item_list: {
                    item: {
                        status: true
                    }
                }
            },
            user: {
                id: 'demos-site',
                firstname: 'Demos',
                lastname: 'User',
                email: 'demos@learnosity.com'
            }
        }
    );

    res.render('item-list', { request });
});

// Reports API
app.get('/reportsapi', function (req, res) {
    const learnositySdk = new Learnosity();

    const request = learnositySdk.init(
        'reports',
        {
            consumer_key: config.consumerKey,
            domain: domain
        },
        config.consumerSecret,
        {
            reports: [
                {
                    id: 'report-1',
                    type: 'sessions-summary',
                    user_id: '$ANONYMIZED_USER_ID'
                }
            ]
        }
    );

    res.render('reports', { request });
});

// Author Aide API
app.get('/authoraide', function (req, res) {
    const learnositySdk = new Learnosity();

    const request = learnositySdk.init(
        'authoraide',
        {
            consumer_key: config.consumerKey,
            domain: domain
        },
        config.consumerSecret,
        {
            user: {
                id: 'demos-site',
                firstname: 'Demos',
                lastname: 'User',
                email: 'demos@learnosity.com'
            }
        }
    );

    res.render('main', { request });
});

// Data API
app.get('/dataapi', async function (req, res) {
    const itembank_uri = 'https://data.learnosity.com/latest-lts/itembank/items';
    const security_packet = {
        consumer_key: config.consumerKey,
        domain: domain
    };

    const dataApi = new DataApi({
        consumerKey: config.consumerKey,
        consumerSecret: config.consumerSecret,
        domain: domain
    });

    // Initialize request metadata (will be populated from first successful request)
    const sdk_version = packageJson.version;
    const request_metadata = {
        endpoint: itembank_uri,
        action: 'get',
        statusCode: null,
        headers: {
            'X-Learnosity-Consumer': dataApi._extractConsumer(security_packet),
            'X-Learnosity-Action': dataApi._deriveAction(itembank_uri, 'get'),
            'X-Learnosity-SDK': `Node.js:${sdk_version}`
        }
    };

    // Demo 1: Manual iteration (5 items)
    const demo1_output = [];
    let demo1_error = null;

    try {
        let data_request = { limit: 1 };

        for (let i = 0; i < 5; i++) {
            const result = await dataApi.request(itembank_uri, security_packet,
                config.consumerSecret, data_request, 'get');

            // Capture status code from the first request
            if (i === 0 && result) {
                request_metadata.statusCode = result.status;
            }

            const response = await result.json();

            if (response.data && response.data.length > 0) {
                const item = response.data[0];

                demo1_output.push({
                    number: i + 1,
                    reference: item.reference || 'N/A',
                    status: item.status || 'N/A'
                });
            }

            if (response.meta && response.meta.next) {
                data_request = { next: response.meta.next };
            } else {
                break;
            }
        }
    } catch (error) {
        demo1_error = error.message;
    }

    // Demo 2: Page iteration (5 pages)
    const demo2_output = [];
    let demo2_error = null;

    try {
        const data_request = { limit: 1 };
        let page_count = 0;

        for await (const page of dataApi.requestIter(itembank_uri, security_packet,
            config.consumerSecret, data_request, 'get')) {
            page_count++;
            const pageData = {
                pageNumber: page_count,
                itemCount: page.data ? page.data.length : 0,
                items: []
            };

            if (page.data) {
                for (const item of page.data) {
                    pageData.items.push({
                        reference: item.reference || 'N/A',
                        status: item.status || 'N/A'
                    });
                }
            }

            demo2_output.push(pageData);

            if (page_count >= 5) {
                break;
            }
        }
    } catch (error) {
        demo2_error = error.message;
    }

    // Demo 3: Results iteration (5 items)
    const demo3_output = [];
    let demo3_error = null;

    try {
        const data_request = { limit: 1 };
        let result_count = 0;

        for await (const item of dataApi.resultsIter(itembank_uri, security_packet,
            config.consumerSecret, data_request, 'get')) {
            result_count++;
            demo3_output.push({
                number: result_count,
                reference: item.reference || 'N/A',
                status: item.status || 'N/A',
                json: JSON.stringify(item, null, 2).substring(0, 500)
            });

            if (result_count >= 5) {
                break;
            }
        }
    } catch (error) {
        demo3_error = error.message;
    }

    res.render('data-api', {
        name: 'Data API Example - With Metadata Headers',
        request_metadata: request_metadata,
        demo1_output: demo1_output,
        demo1_error: demo1_error,
        demo2_output: demo2_output,
        demo2_error: demo2_error,
        demo3_output: demo3_output,
        demo3_error: demo3_error
    });
});

app.listen(port, function () {
    console.log(`Server started http://${domain}:${port}. Press Ctrl-c to quit.`);
});

