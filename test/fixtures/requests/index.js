'use strict';

const fs = require('fs');
const path = require('path');

function loadJson(filename) {
    return fs.readFileSync(path.join(__dirname, `${filename}.json`));
}

const SECRET = '74c5fd430cf1242a527f6223aebd42d30464be22';

function getSecurityObject()
{
    return {
        consumer_key: 'yis0TYCu7U9V4o7M',
        domain: 'localhost',
        timestamp: '20140626-0528'
    };
}

const requestStrings = {
    assess: loadJson('assessAPI'),
    author: loadJson('authorAPI'),
    data: loadJson('dataAPI'),
    items: loadJson('itemsAPI'),
    questions: loadJson('questionsAPI'),
    reports: loadJson('reportsAPI')
};

function getRequestFor(service) {
    return JSON.parse(requestStrings[service]);
}

function getSDKParamsFor(service) {
    const params = {
        service,
        security: getSecurityObject(),
        secret: SECRET,
        request: getRequestFor(service)
    };

    switch (service) {
        case 'assess':
        case 'questions':
            params.security.user_id = '$ANONYMIZED_USER_ID';
            break;
        case 'items':
            params.security.user_id = params.request.user_id;
            break;
        default:
            // nothing
            break;
    }

    return params;
}

module.exports = {
    getSDKParamsFor,
    getRequestFor
};
