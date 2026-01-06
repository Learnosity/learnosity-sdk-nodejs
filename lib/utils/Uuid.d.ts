export = Uuid;

/**
 * UUID utility for generating UUIDv4 identifiers
 * Commonly used for user_id and session_id in Learnosity API requests
 */
declare class Uuid {
    /**
     * Generate a UUIDv4 string
     * @returns A UUIDv4 string
     */
    static generate(): string;
}

