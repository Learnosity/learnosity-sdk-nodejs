'use strict';

/**
 *--------------------------------------------------------------------------
 * Learnosity SDK - Init
 *--------------------------------------------------------------------------
 *
 * Used to generate the necessary security and request data (in the
 * correct format) to integrate with any of the Learnosity API services.
 *
 */

const _ = require('underscore');
const crypto = require('crypto');
const moment = require('moment');
const os = require('os');
const moduleInfo = require('./package.json');

/**
 *  Converts the request packet into an object if it is passed as a string
 *
 * @param requestPacket
 * @returns object
 */
function convertRequestPacketToObject(requestPacket) {
    if (_.isString(requestPacket)) {
        return JSON.parse(requestPacket);
    } else {
        return requestPacket;
    }
}

const sdkMeta = {
    version: 'v' + moduleInfo.version,
    lang: 'node.js',
    lang_version: process.version,
    platform: os.platform(),
    platform_version: os.release()
};

function addTelemetryData(requestObject) {
    if (requestObject && requestObject.meta) {
        requestObject.meta.sdk = sdkMeta;
    } else if (requestObject) {
        requestObject.meta = {
            sdk: sdkMeta
        };
    }

    return requestObject;
}

/**
 * Insert security information into assess request object
 *
 * @param requestPacket    requestPacket is mutated as a result.
 * @param securityPacket
 * @param secret
 */
function insertSecurityInformationToAssessObject(requestPacket, securityPacket, secret) {
    if (requestPacket.questionsApiActivity) {
        const questionsApi = requestPacket.questionsApiActivity;
        let domain = 'assess.learnosity.com';

        if (securityPacket.domain) {
            domain = securityPacket.domain;
        } else if (questionsApi.domain) {
            domain = questionsApi.domain;
        }

        requestPacket.questionsApiActivity.consumer_key = securityPacket.consumer_key;
        requestPacket.questionsApiActivity.timestamp = securityPacket.timestamp;
        requestPacket.questionsApiActivity.user_id = securityPacket.user_id;
        requestPacket.questionsApiActivity.signature = hashSignatureArray([
            securityPacket.consumer_key,
            domain,
            securityPacket.timestamp,
            securityPacket.user_id,
            secret
        ]);
    }
}

/**
 * Creates the signature hash.
 *
 * @param service        string
 * @param securityPacket object
 * @param secret         string
 * @param requestString  string
 * @param action         object
 */
function generateSignature(
    service,
    securityPacket,
    secret,
    requestString,
    action
) {
    const signatureArray = [
        securityPacket.consumer_key,
        securityPacket.domain,
        securityPacket.timestamp
    ];

    if (securityPacket.user_id) {
        signatureArray.push(securityPacket.user_id);
    }
    signatureArray.push(secret);

    // Add the requestPacket if necessary
    const signRequestData = !(service === 'assess' || service === 'questions');

    if (signRequestData && requestString && requestString.length > 0) {
        signatureArray.push(requestString);
    }

    // Add the action if necessary
    if (action && action.length > 0) {
        signatureArray.push(action);
    }

    return hashSignatureArray(signatureArray);
}

/**
 * Joins an array (with '_') and hashes it.
 *
 * @param signatureArray array
 * @returns string
 */
function hashSignatureArray(signatureArray) {
    const hash = crypto.createHash('sha256');

    hash.update(signatureArray.join('_'));
    return hash.digest('hex');
}

/**
 * @constructor
 */
function LearnositySDK() {}
let telemetryEnabled = true;

/**
 * Enables telemetry.
 *
 * Telemetry is enabled by default. We use it to enable better support and feature planning.
 * It is however not advised to disable it, and it will not interfere with any usage.
 */
LearnositySDK.enableTelemetry = function () {
    telemetryEnabled = true;
};

/**
 * Disables telemetry.
 *
 * We use telemetry to enable better support and feature planning. It is therefore not advised to
 * disable it, because it will not interfere with any usage.
 */
LearnositySDK.disableTelemetry = function () {
    telemetryEnabled = false;
};

/**
 * @see https://github.com/Learnosity/learnosity-sdk-nodejs For more information
 *
 * @param service        string
 * @param securityPacket object
 * @param secret         string
 * @param requestPacket  object
 * @param action         object
 *
 * @returns object The init options for a Learnosity API
 */
LearnositySDK.prototype.init = function (
    service,
    securityPacket,
    secret,
    requestPacket,
    action
) {
    // requestPacket can be passed in as an object or as an already encoded
    // string.
    const requestObject = convertRequestPacketToObject(requestPacket);

    if (telemetryEnabled) {
        addTelemetryData(requestObject);
    }

    // Automatically timestamp the security packet
    if (!securityPacket.timestamp) {
        securityPacket.timestamp = moment().utc().format('YYYYMMDD-HHmm');
    }

    if (service === 'assess') {
        insertSecurityInformationToAssessObject(requestObject, securityPacket, secret);
    }

    // Automatically populate the user_id of the security packet.
    if (_.contains(['author', 'items', 'reports'], service)) {
        // The Events API requires a user_id, so we make sure it's a part
        // of the security packet as we share the signature in some cases
        if (!securityPacket.user_id && requestObject && requestObject.user_id) {
            securityPacket.user_id = requestObject.user_id;
        }
    }

    const requestString = JSON.stringify(requestObject);

    // Generate the signature based on the arguments provided
    securityPacket.signature = generateSignature(
        service,
        securityPacket,
        secret,
        requestString,
        action
    );

    let output;

    if (service === 'data') {
        output = {
            'security': JSON.stringify(securityPacket),
            'request': requestString,
            'action': action
        };
    } else if (service === 'questions') {
        // Questions API Requests don't need `domain`
        delete securityPacket.domain;

        output = _.extend(securityPacket, requestObject);
    } else if (service === 'assess') {
        output = requestObject;
    } else {
        output = {
            'security': securityPacket,
            'request': _.isString(requestPacket) ? requestString : requestObject
        };
    }

    return output;
};

module.exports = LearnositySDK;
