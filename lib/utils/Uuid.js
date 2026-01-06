'use strict';

/**
 * UUID utility for generating UUIDv4 identifiers
 * Commonly used for user_id and session_id in Learnosity API requests
 */

const { v4: uuidv4 } = require('uuid');

class Uuid {
    /**
     * Generate a UUIDv4 string
     * @returns {string} A UUIDv4 string
     */
    static generate() {
        return uuidv4();
    }
}

module.exports = Uuid;

