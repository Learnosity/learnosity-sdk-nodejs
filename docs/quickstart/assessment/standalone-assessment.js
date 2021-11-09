const express = require('express');
const app = express();
const uuid = require('uuid');
const Learnosity = require('../../../index');
const config = require('../config');

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    const learnositySdk = new Learnosity();
    const request = learnositySdk.init(
        'items',
        {
            consumer_key: config.consumerKey,
            domain: 'localhost',            
        },
        config.consumerSecret,
        {
            type: 'local_practice',
            state: 'initial',
            activity_id: 'demo_3',
            rendering_type: 'assess',
            session_id: uuid.v4(),
            items: ['Demo3', 'Demo4'],
            user_id: 'test_user',
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