'use strict';

const assert = require('assert');
const LearnositySDK = require('../index');
const Uuid = LearnositySDK.Uuid;

describe('Uuid utility', () => {
    describe('generate()', () => {
        it('should generate a valid UUIDv4 string', () => {
            const uuid = Uuid.generate();

            // UUIDv4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
            const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

            assert.strictEqual(typeof uuid, 'string');
            assert.strictEqual(uuid.length, 36);
            assert.match(uuid, uuidv4Regex);
        });

        it('should generate unique UUIDs', () => {
            const uuid1 = Uuid.generate();
            const uuid2 = Uuid.generate();

            assert.notStrictEqual(uuid1, uuid2);
        });

        it('should be accessible via LearnositySDK.Uuid', () => {
            assert.strictEqual(typeof LearnositySDK.Uuid, 'function');
            assert.strictEqual(typeof LearnositySDK.Uuid.generate, 'function');
        });

        it('should generate 1000 unique UUIDs', () => {
            const uuids = new Set();

            for (let i = 0; i < 1000; i++) {
                uuids.add(Uuid.generate());
            }

            assert.strictEqual(uuids.size, 1000);
        });
    });
});

