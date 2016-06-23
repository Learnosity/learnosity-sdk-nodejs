/**
 *--------------------------------------------------------------------------
 * Learnosity SDK - Init
 *--------------------------------------------------------------------------
 *
 * Used to generate the necessary security and request data (in the
 * correct format) to integrate with any of the Learnosity API services.
 *
 */

var sha256 = require('crypto-js/sha256');
var moment = require('moment');

var Learnosity = {

    /**
     * Most services add the request packet (if passed) to the signature
     * for security reasons. This flag can override that behaviour for
     * services that don't require this.
     * @var boolean
     */
    signRequestData: true,
    /**
     * Keynames that are valid in the securityPacket, they are also in
     * the correct order for signature generation.
     * @var string[]
     */
    validSecurityKeys: ['consumer_key', 'domain', 'timestamp', 'user_id'],

    /**
     * Service names that are valid for `service`
     * @var string[]
     */
    validServices: ['assess', 'author', 'items', 'questions', 'reports'],

    /**
     * @see https://docs.learnosity.com/ For more information
     *
     * @param service
     * @param securityPacket
     * @param secret
     * @param requestPacket
     * @param action
     *
     * @returns {*} The init options for a Learnosity API
     */
    init: function(service, securityPacket, secret, requestPacket, action) {

        if (!securityPacket.timestamp) {
            securityPacket.timestamp = this.helper.timestamp();
        }

        this.service = service;
        this.securityPacket = securityPacket;
        this.secret = secret;
        if (requestPacket) {
            this.requestPacket = requestPacket;
            this.requestString = typeof requestPacket == 'string' ? requestPacket : JSON.stringify(requestPacket);
        }
        this.action = action;

        // Set any service specific options
        this.setServiceOptions(this.securityPacket, this.requestPacket, this.service, this.secret);

        // Generate the signature based on the arguments provided
        this.securityPacket.signature = this.generateSignature();

        //NOTE: if we support { 'security': {}, 'request': {} } this goes away!
        var output;
        if(this.service == 'questions') {
            output = this.helper.extend(this.securityPacket, this.requestPacket);
        } else {
            output = {
                'security': this.securityPacket,
                'request': this.requestPacket
            };
        }

        return output;
    },

    /**
     * Generate a signature hash for the request, this includes:
     *  - the security credentials
     *  - the `request` packet (a JSON string) if passed
     *  - the `action` value if passed
     *
     * @return string A signature hash for the request authentication
     */
    generateSignature: function() {
        var self = this;
        var signatureArray = [];

        // Create a pre-hash string based on the security credentials
        // The order is important
        this.validSecurityKeys.forEach(function(key) {
            if (self.securityPacket[key]) {
                signatureArray.push(self.securityPacket[key]);
            }
        });

        // Add the secret
        signatureArray.push(this.secret);

        // Add the requestPacket if necessary
        if (this.signRequestData && this.requestString && this.requestString.length > 0) {
            signatureArray.push(this.requestString);
        }

        // Add the action if necessary
        if (this.action && this.action.length > 0) {
            signatureArray.push(this.action);
        }

        return this.hashValue(signatureArray);
    },

    /**
     * Hash an array value
     *
     * @param  value string[]  An array to hash
     *
     * @return string The hashed string
     */
    hashValue: function(value) {
        return sha256(value.join('_')).toString();
    },

    /**
     * Set any options for services that aren't generic
     */
    setServiceOptions: function(security, request, service, secret) {
        switch (this.service) {
            case 'assess':
            case 'questions':
                this.signRequestData = false;
                // The Assess API holds data for the Questions API that includes
                // security information and a signature. Retrieve the security
                // information from this and generate a signature for the
                // Questions API
                if (this.service === 'assess' && request.questionsApiActivity) {
                    var questionsApi = request.questionsApiActivity;
                    var domain = 'assess.learnosity.com';
                    if (security.domain) {
                        domain = security.domain;
                    } else if (questionsApi.domain) {
                        domain = questionsApi.domain;
                    }

                    request.questionsApiActivity = {
                        'consumer_key': security.consumer_key,
                        'timestamp': security.timestamp,
                        'user_id': security.user_id,
                        'signature': this.hashValue(
                            {
                                'consumer_key': security.consumer_key,
                                'domain': domain,
                                'timestamp': security.timestamp,
                                'user_id': security.user_id,
                                'secret': secret
                            }
                        )
                    };

                    delete questionsApi.consumer_key;
                    delete questionsApi.domain;
                    delete questionsApi.timestamp;
                    delete questionsApi.user_id;
                    delete questionsApi.signature;

                    request.questionsApiActivity = request.questionsApiActivity.concat(questionsApi);
                }
                break;
            case 'author':
            case 'data':
            case 'items':
            case 'reports':
                // The Events API requires a user_id, so we make sure it's a part
                // of the security packet as we share the signature in some cases
                if (!security.user_id && request && request.user_id) {
                    this.securityPacket.user_id = request.user_id;
                }

                break;
            default:
                // do nothing
                break;
        }
    },

    helper: {
        timestamp: function() {
            var now = new Date(Date.now()),
                date = new Date(now.valueOf() + now.getTimezoneOffset() * 60000);

            return moment(date).format('YYYYMMDD-HHmm');
        },

        extend: function(a, b) {
            for(var key in b) {
                if(b.hasOwnProperty(key)) {
                    a[key] = b[key];
                }
            }
            return a;
        }
    }

};

module.exports = Learnosity;