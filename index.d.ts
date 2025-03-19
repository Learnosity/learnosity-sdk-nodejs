export = LearnositySDK;
/**
 * @constructor
 */
declare function LearnositySDK(): void;
declare class LearnositySDK {
    /**
     * @see https://github.com/Learnosity/learnosity-sdk-nodejs For more information
     *
     * @param {Service} service
     * @param {SecurityPacket} securityPacket
     * @param {string} secret
     * @param {RequestPacket} requestPacket
     * @param {Action} [action]
     *
     * @returns object The init options for a Learnosity API
     */
    init(service: Service, securityPacket: SecurityPacket, secret: string, requestPacket: RequestPacket, action?: Action): any;
}
declare namespace LearnositySDK {
    export { enableTelemetry, disableTelemetry, SecurityPacket, SDKMeta, RequestMeta, RequestPacket, Service, Action };
}
/**
 * Enables telemetry.
 *
 * Telemetry is enabled by default. We use it to enable better support and feature planning.
 * It is however not advised to disable it, and it will not interfere with any usage.
 */
declare function enableTelemetry(): void;
/**
 * Disables telemetry.
 *
 * We use telemetry to enable better support and feature planning. It is therefore not advised to
 * disable it, because it will not interfere with any usage.
 */
declare function disableTelemetry(): void;
type SecurityPacket = {
    consumer_key: string;
    domain: string;
    timestamp?: `${number}-${number}`;
    user_id?: string;
    expires?: string;
};
type SDKMeta = {
    version: string;
    lang: string;
    lang_version: string;
    platform: NodeJS.Platform;
    platform_version: string;
};
type RequestMeta = {
    meta?: {
        sdk?: SDKMeta;
    };
};
type RequestPacket = Record<string, any> & RequestMeta;
type Service = 'assess' | 'author' | 'authoraide' | 'items' | 'reports' | 'questions' | 'data';
type Action = 'get' | 'set' | 'update';
