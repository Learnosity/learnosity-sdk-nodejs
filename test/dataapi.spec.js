'use strict';

const assert = require('assert');
const DataApi = require('../lib/DataApi');

describe('DataApi', function () {
    const config = {
        consumerKey: 'yis0TYCu7U9V4o7M',
        consumerSecret: '74c5fd430cf1242a527f6223aebd42d30464be22',
        domain: 'localhost'
    };

    const securityPacket = {
        consumer_key: config.consumerKey,
        domain: config.domain
    };

    describe('constructor', function () {
        it('should create instance with options', function () {
            const dataApi = new DataApi(config);

            assert.strictEqual(dataApi.consumerKey, config.consumerKey);
            assert.strictEqual(dataApi.consumerSecret, config.consumerSecret);
            assert.strictEqual(dataApi.domain, config.domain);
        });

        it('should create instance without options', function () {
            const dataApi = new DataApi();

            assert.ok(dataApi);
        });
    });

    describe('_extractConsumer', function () {
        it('should extract consumer key from security packet', function () {
            const dataApi = new DataApi(config);
            const consumer = dataApi._extractConsumer(securityPacket);

            assert.strictEqual(consumer, config.consumerKey);
        });

        it('should return empty string if no consumer key', function () {
            const dataApi = new DataApi(config);
            const consumer = dataApi._extractConsumer({});

            assert.strictEqual(consumer, '');
        });
    });

    describe('_deriveAction', function () {
        it('should derive action from endpoint with version', function () {
            const dataApi = new DataApi(config);
            const action = dataApi._deriveAction(
                'https://data.learnosity.com/v2023.1.LTS/itembank/items',
                'get'
            );

            assert.strictEqual(action, 'get_/itembank/items');
        });

        it('should derive action from endpoint with latest', function () {
            const dataApi = new DataApi(config);
            const action = dataApi._deriveAction(
                'https://data.learnosity.com/latest/itembank/items',
                'get'
            );

            assert.strictEqual(action, 'get_/itembank/items');
        });

        it('should derive action from endpoint without version', function () {
            const dataApi = new DataApi(config);
            const action = dataApi._deriveAction(
                'https://data.learnosity.com/itembank/items',
                'get'
            );

            assert.strictEqual(action, 'get_/itembank/items');
        });

        it('should handle trailing slash', function () {
            const dataApi = new DataApi(config);
            const action = dataApi._deriveAction(
                'https://data.learnosity.com/v1/itembank/items/',
                'get'
            );

            assert.strictEqual(action, 'get_/itembank/items');
        });
    });

    describe('request', function () {
        it('should make a request with mock adapter', async function () {
            const mockResponse = {
                meta: { status: true, records: 1 },
                data: [{ reference: 'item_1' }]
            };

            const mockAdapter = async (url, options) => {
                assert.strictEqual(url, 'https://data.learnosity.com/v1/itembank/items');
                assert.strictEqual(options.method, 'POST');
                assert.ok(options.headers['X-Learnosity-Consumer']);
                assert.ok(options.headers['X-Learnosity-Action']);
                assert.ok(options.headers['X-Learnosity-SDK']);
                assert.ok(options.body.includes('security='));

                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => mockResponse,
                    text: async () => JSON.stringify(mockResponse)
                };
            };

            const dataApi = new DataApi({ ...config, httpAdapter: mockAdapter });
            const response = await dataApi.request(
                'https://data.learnosity.com/v1/itembank/items',
                securityPacket,
                config.consumerSecret,
                { limit: 1 },
                'get'
            );

            assert.ok(response.ok);
            assert.strictEqual(response.status, 200);
            const data = await response.json();

            assert.deepStrictEqual(data, mockResponse);
        });
    });

    describe('requestIter', function () {
        it('should iterate through pages', async function () {
            const mockResponses = [
                {
                    meta: { status: true, records: 2, next: 'page2' },
                    data: [{ id: 'a' }]
                },
                {
                    meta: { status: true, records: 2 },
                    data: [{ id: 'b' }]
                }
            ];

            let callCount = 0;
            const mockAdapter = async () => {
                const response = mockResponses[callCount++];

                return {
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    json: async () => response,
                    text: async () => JSON.stringify(response)
                };
            };

            const dataApi = new DataApi({ ...config, httpAdapter: mockAdapter });
            const pages = [];

            for await (const page of dataApi.requestIter(
                'https://data.learnosity.com/v1/itembank/items',
                securityPacket,
                config.consumerSecret,
                {},
                'get'
            )) {
                pages.push(page);
            }

            assert.strictEqual(pages.length, 2);
            assert.strictEqual(pages[0].data[0].id, 'a');
            assert.strictEqual(pages[1].data[0].id, 'b');
        });
    });
});

