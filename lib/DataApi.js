'use strict';

/**
 * DataApi - Routing layer for Learnosity Data API
 *
 * Provides methods to make HTTP requests to the Data API with automatic
 * signing and pagination support.
 */

// Lazy load to avoid circular dependency
let LearnositySDK = null;

class DataApi {
    /**
     * @param {Object} options - Configuration options
     * @param {string} options.consumerKey - Learnosity consumer key
     * @param {string} options.consumerSecret - Learnosity consumer secret
     * @param {string} options.domain - Domain for security packet
     * @param {Function} [options.httpAdapter] - Optional custom HTTP adapter
     */
    constructor(options = {}) {
        this.consumerKey = options.consumerKey;
        this.consumerSecret = options.consumerSecret;
        this.domain = options.domain;
        this.httpAdapter = options.httpAdapter || this._defaultHttpAdapter.bind(this);

        // Lazy load SDK to avoid circular dependency
        if (!LearnositySDK) {
            LearnositySDK = require('../index');
        }
        this.sdk = new LearnositySDK();
    }

    /**
     * Default HTTP adapter using native fetch
     * @private
     */
    async _defaultHttpAdapter(url, options) {
        const response = await fetch(url, options);

        return ({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            json: async () => response.json(),
            text: async () => response.text()
        });
    }

    /**
     * Extract consumer key from security packet
     * @private
     */
    _extractConsumer(securityPacket) {
        return securityPacket.consumer_key || '';
    }

    /**
     * Derive action metadata from endpoint and action
     * @private
     */
    _deriveAction(endpoint, action) {
        const url = new URL(endpoint);
        let path = url.pathname.replace(/\/$/, '');

        // Remove version prefix (e.g., /v1, /v2023.1.LTS, /latest)
        const pathParts = path.split('/');

        if (pathParts.length > 1) {
            const firstSegment = pathParts[1].toLowerCase();
            const versionPattern = /^v[\d.]+(?:\.(lts|preview\d+))?$/;
            const specialVersions = ['latest', 'latest-lts', 'developer'];

            if (versionPattern.test(firstSegment) || specialVersions.includes(firstSegment)) {
                path = '/' + pathParts.slice(2).join('/');
            }
        }

        return `${action}_${path}`;
    }

    /**
     * Make a single request to Data API
     *
     * @param {string} endpoint - Full URL to the Data API endpoint
     * @param {Object} securityPacket - Security object with consumer_key and domain
     * @param {string} secret - Consumer secret
     * @param {Object} [requestPacket={}] - Request parameters
     * @param {string} [action='get'] - Action type: 'get', 'set', 'update', 'delete'
     * @returns {Promise<Object>} Response object with status, data, etc.
     */
    async request(endpoint, securityPacket, secret, requestPacket = {}, action = 'get') {
        // Generate signed request using SDK
        const signedRequest = this.sdk.init('data', securityPacket, secret, requestPacket, action);

        // Extract metadata for routing
        const consumer = this._extractConsumer(securityPacket);
        const derivedAction = this._deriveAction(endpoint, action);

        // Get SDK version from package.json
        const packageInfo = require('../package.json');
        const sdkVersion = packageInfo.version;

        // Prepare headers with routing metadata
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Learnosity-Consumer': consumer,
            'X-Learnosity-Action': derivedAction,
            'X-Learnosity-SDK': `Node.js:${sdkVersion}`
        };

        // Convert signed request to URL-encoded format
        const formBody = new URLSearchParams({
            security: signedRequest.security,
            request: signedRequest.request,
            action: signedRequest.action
        }).toString();

        // Make HTTP request
        const response = await this.httpAdapter(endpoint, {
            method: 'POST',
            headers: headers,
            body: formBody
        });

        return response;
    }

    /**
     * Iterate over pages of results from Data API
     *
     * @param {string} endpoint - Full URL to the Data API endpoint
     * @param {Object} securityPacket - Security object
     * @param {string} secret - Consumer secret
     * @param {Object} [requestPacket={}] - Request parameters
     * @param {string} [action='get'] - Action type
     * @returns {AsyncGenerator<Object>} Async generator yielding pages of results
     */
    async *requestIter(endpoint, securityPacket, secret, requestPacket = {}, action = 'get') {
        // Deep copy to avoid mutation
        const security = JSON.parse(JSON.stringify(securityPacket));
        const request = JSON.parse(JSON.stringify(requestPacket));
        let dataEnd = false;

        while (!dataEnd) {
            const response = await this.request(endpoint, security, secret, request, action);

            if (!response.ok) {
                const text = await response.text();

                throw new Error(`Server returned HTTP status ${response.status}: ${text}`);
            }

            let data;

            try {
                data = await response.json();
            } catch (error) {
                const text = await response.text();

                throw new Error(`Server returned invalid JSON: ${text}`);
            }

            if (data.meta && data.meta.next && data.data && data.data.length > 0) {
                request.next = data.meta.next;
            } else {
                dataEnd = true;
            }

            if (!data.meta || !data.meta.status) {
                throw new Error(`Server returned unsuccessful status: ${JSON.stringify(data)}`);
            }

            yield data;
        }
    }

    /**
     * Iterate over individual results from Data API
     *
     * Automatically handles pagination and yields each individual result
     * from the data array.
     *
     * @param {string} endpoint - Full URL to the Data API endpoint
     * @param {Object} securityPacket - Security object
     * @param {string} secret - Consumer secret
     * @param {Object} [requestPacket={}] - Request parameters
     * @param {string} [action='get'] - Action type
     * @returns {AsyncGenerator<Object>} Async generator yielding individual results
     */
    async *resultsIter(endpoint, securityPacket, secret, requestPacket = {}, action = 'get') {
        for await (const page of this.requestIter(endpoint, securityPacket, secret, requestPacket, action)) {
            if (typeof page.data === 'object' && !Array.isArray(page.data)) {
                // If data is an object (not array), yield key-value pairs
                for (const [key, value] of Object.entries(page.data)) {
                    yield ({ [key]: value });
                }
            } else if (Array.isArray(page.data)) {
                // If data is an array, yield each item
                for (const result of page.data) {
                    yield result;
                }
            }
        }
    }
}

module.exports = DataApi;
