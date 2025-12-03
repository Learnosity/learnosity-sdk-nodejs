'use strict';

/**
 * Integration tests for DataApi
 *
 * These tests verify that the DataApi class correctly:
 * - Signs requests
 * - Adds routing metadata headers
 * - Formats requests properly
 *
 * Note: These tests use a mock HTTP adapter and do not make real API calls.
 */

const assert = require('assert');
const DataApi = require('../lib/DataApi');

describe('DataApi Integration Tests', function () {
    const config = {
        consumerKey: 'yis0TYCu7U9V4o7M',
        consumerSecret: '74c5fd430cf1242a527f6223aebd42d30464be22',
        domain: 'localhost'
    };

    describe('Request signing and formatting', function () {
        it('should properly sign and format a Data API request', async function () {
            let capturedRequest = null;

            const mockAdapter = async (url, options) => {
                capturedRequest = {
                    url,
                    method: options.method,
                    headers: options.headers,
                    body: options.body
                };

                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => ({
                        meta: { status: true, records: 0 },
                        data: []
                    }),
                    text: async () => JSON.stringify({
                        meta: { status: true, records: 0 },
                        data: []
                    })
                };
            };

            const dataApi = new DataApi({ ...config, httpAdapter: mockAdapter });

            await dataApi.request(
                'https://data.learnosity.com/v2023.1.LTS/itembank/items',
                {
                    consumer_key: config.consumerKey,
                    domain: config.domain
                },
                config.consumerSecret,
                {
                    limit: 5,
                    references: ['item_1', 'item_2']
                },
                'get'
            );

            // Verify request was captured
            assert.ok(capturedRequest, 'Request should be captured');

            // Verify URL
            assert.strictEqual(
                capturedRequest.url,
                'https://data.learnosity.com/v2023.1.LTS/itembank/items'
            );

            // Verify method
            assert.strictEqual(capturedRequest.method, 'POST');

            // Verify headers
            assert.strictEqual(
                capturedRequest.headers['Content-Type'],
                'application/x-www-form-urlencoded'
            );
            assert.strictEqual(
                capturedRequest.headers['X-Learnosity-Consumer'],
                config.consumerKey
            );
            assert.strictEqual(
                capturedRequest.headers['X-Learnosity-Action'],
                'get_/itembank/items'
            );
            assert.ok(
                capturedRequest.headers['X-Learnosity-SDK'].startsWith('Node.js:')
            );

            // Verify body contains required fields
            assert.ok(capturedRequest.body.includes('security='));
            assert.ok(capturedRequest.body.includes('request='));
            assert.ok(capturedRequest.body.includes('action='));
            assert.ok(capturedRequest.body.includes('signature'));
        });

        it('should handle different API versions in endpoint', async function () {
            const testCases = [
                {
                    endpoint: 'https://data.learnosity.com/v1/itembank/items',
                    expectedAction: 'get_/itembank/items'
                },
                {
                    endpoint: 'https://data.learnosity.com/v2023.1.LTS/itembank/items',
                    expectedAction: 'get_/itembank/items'
                },
                {
                    endpoint: 'https://data.learnosity.com/latest/itembank/items',
                    expectedAction: 'get_/itembank/items'
                },
                {
                    endpoint: 'https://data.learnosity.com/latest-lts/itembank/items',
                    expectedAction: 'get_/itembank/items'
                }
            ];

            for (const testCase of testCases) {
                let capturedAction = null;

                const mockAdapter = async (url, options) => {
                    capturedAction = options.headers['X-Learnosity-Action'];
                    return ({
                        ok: true,
                        status: 200,
                        statusText: 'OK',
                        json: async () => ({ meta: { status: true }, data: [] }),
                        text: async () => '{}'
                    });
                };

                const dataApi = new DataApi({ ...config, httpAdapter: mockAdapter });

                await dataApi.request(
                    testCase.endpoint,
                    { consumer_key: config.consumerKey, domain: config.domain },
                    config.consumerSecret,
                    {},
                    'get'
                );

                assert.strictEqual(
                    capturedAction,
                    testCase.expectedAction,
                    `Failed for endpoint: ${testCase.endpoint}`
                );
            }
        });
    });

    describe('Export from main module', function () {
        it('should be accessible via LearnositySDK.DataApi', function () {
            const LearnositySDK = require('../index');

            assert.ok(LearnositySDK.DataApi, 'DataApi should be exported');
            assert.strictEqual(typeof LearnositySDK.DataApi, 'function');

            // Should be instantiable
            const dataApi = new LearnositySDK.DataApi({
                consumerKey: 'test',
                consumerSecret: 'test',
                domain: 'test.com'
            });

            assert.ok(dataApi instanceof LearnositySDK.DataApi);
        });
    });
});

