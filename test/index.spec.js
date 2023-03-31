'use strict';

const assert = require('assert');
const LearnositySDK = require('../index');
const {getSDKParamsFor} = require('./fixtures/requests');

describe('init function', () => {
    const testCases = [
        {
            service: 'assess',
            signature: '$02$8de51b7601f606a7f32665541026580d09616028dde9a929ce81cf2e88f56eb8',
            outputString: '{"items":[{"content":"<span class=\\"learnosity-response question-demoscience1234\\"></span>","response_ids":["demoscience1234"],"workflow":"","reference":"question-demoscience1"},{"content":"<span class=\\"learnosity-response question-demoscience5678\\"></span>","response_ids":["demoscience5678"],"workflow":"","reference":"question-demoscience2"}],"ui_style":"horizontal","name":"Demo (2 questions)","state":"initial","metadata":{},"navigation":{"show_next":true,"toc":true,"show_submit":true,"show_save":false,"show_prev":true,"show_title":true,"show_intro":true},"time":{"max_time":600,"limit_type":"soft","show_pause":true,"warning_time":60,"show_time":true},"configuration":{"onsubmit_redirect_url":"/assessment/","onsave_redirect_url":"/assessment/","idle_timeout":true,"questionsApiVersion":"v2"},"questionsApiActivity":{"user_id":"$ANONYMIZED_USER_ID","type":"submit_practice","state":"initial","id":"assessdemo","name":"Assess API - Demo","questions":[{"response_id":"demoscience1234","type":"sortlist","description":"In this question, the student needs to sort the events, chronologically earliest to latest.","list":["Russian Revolution","Discovery of the Americas","Storming of the Bastille","Battle of Plataea","Founding of Rome","First Crusade"],"instant_feedback":true,"feedback_attempts":2,"validation":{"valid_response":[4,3,5,1,2,0],"valid_score":1,"partial_scoring":true,"penalty_score":-1}},{"response_id":"demoscience5678","type":"highlight","description":"The student needs to mark one of the flowers anthers in the image.","img_src":"http://www.learnosity.com/static/img/flower.jpg","line_color":"rgb(255, 20, 0)","line_width":"4"}],"consumer_key":"yis0TYCu7U9V4o7M","timestamp":"20140626-0528","signature":"$02$8de51b7601f606a7f32665541026580d09616028dde9a929ce81cf2e88f56eb8"},"type":"activity"}'
        },
        {
            service: 'author',
            signature: '$02$ca2769c4be77037cf22e0f7a2291fe48c470ac6db2f45520a259907370eff861',
            outputString: '{"security":{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","signature":"$02$ca2769c4be77037cf22e0f7a2291fe48c470ac6db2f45520a259907370eff861"},"request":{"mode":"item_list","config":{"item_list":{"item":{"status":true}}},"user":{"id":"walterwhite","firstname":"walter","lastname":"white"}}}'
        },
        {
            service: 'data',
            signature: '$02$e19c8a62fba81ef6baf2731e2ab0512feaf573ca5ca5929c2ee9a77303d2e197',
            security: '{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","signature":"$02$e19c8a62fba81ef6baf2731e2ab0512feaf573ca5ca5929c2ee9a77303d2e197"}',
            request: '{"limit":100}',
            action: 'get'
        },
        {
            service: 'data',
            signature: '$02$9d1971fb9ac51482f7e73dcf87fc029d4a3dfffa05314f71af9d89fb3c2bcf16',
            security: '{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","signature":"$02$9d1971fb9ac51482f7e73dcf87fc029d4a3dfffa05314f71af9d89fb3c2bcf16"}',
            request: '{"limit":100}',
            action: 'post'
        },
        {
            service: 'items',
            signature: '$02$36c439e7d18f2347ce08ca4b8d4803a22325d54352650b19b6f4aaa521b613d9',
            outputString: '{"security":{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","user_id":"$ANONYMIZED_USER_ID","signature":"$02$36c439e7d18f2347ce08ca4b8d4803a22325d54352650b19b6f4aaa521b613d9"},"request":{"user_id":"$ANONYMIZED_USER_ID","rendering_type":"assess","name":"Items API demo - assess activity demo","state":"initial","activity_id":"items_assess_demo","session_id":"demo_session_uuid","type":"submit_practice","config":{"configuration":{"responsive_regions":true},"navigation":{"scrolling_indicator":true},"regions":"main","time":{"show_pause":true,"max_time":300},"title":"ItemsAPI Assess Isolation Demo","subtitle":"Testing Subtitle Text"},"items":["Demo3"]}}'
        },
        {
            service: 'questions',
            signature: '$02$8de51b7601f606a7f32665541026580d09616028dde9a929ce81cf2e88f56eb8',
            outputString: '{"consumer_key":"yis0TYCu7U9V4o7M","timestamp":"20140626-0528","user_id":"$ANONYMIZED_USER_ID","signature":"$02$8de51b7601f606a7f32665541026580d09616028dde9a929ce81cf2e88f56eb8","type":"local_practice","state":"initial","questions":[{"response_id":"60005","type":"association","stimulus":"Match the cities to the parent nation.","stimulus_list":["London","Dublin","Paris","Sydney"],"possible_responses":["Australia","France","Ireland","England"],"validation":{"valid_responses":[["England"],["Ireland"],["France"],["Australia"]]}}]}'
        },
        {
            service: 'reports',
            signature: '$02$8e0069e7aa8058b47509f35be236c53fa1a878c64b12589fd42f48b568f6ac84',
            outputString: '{"security":{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","signature":"$02$8e0069e7aa8058b47509f35be236c53fa1a878c64b12589fd42f48b568f6ac84"},"request":{"reports":[{"id":"report-1","type":"sessions-summary","user_id":"$ANONYMIZED_USER_ID","session_ids":["AC023456-2C73-44DC-82DA28894FCBC3BF"]}]}}'
        }
    ];

    describe('signature generation', () => {
        before(() => LearnositySDK.disableTelemetry()); // telemetry will affect signature output

        testCases.forEach((testCase) => {
            it(`should generate the expected signature for ${testCase.service} ${ testCase.action ? testCase.action : ''}`, () => {
                const requestParams = getSDKParamsFor(testCase.service);
                const output = (new LearnositySDK()).init(
                    requestParams.service,
                    requestParams.security,
                    requestParams.secret,
                    requestParams.request,
                    testCase.action
                );

                switch (testCase.service) {
                    case 'assess': // assess API puts the security signature in the questions API activity
                        assert.strictEqual(output.questionsApiActivity.signature, testCase.signature);
                        break;
                    case 'data': // data API outputs the security object as a string
                        assert.strictEqual(
                            output.security.match(/"signature":"(\$02\$\w+)"/)[1],
                            testCase.signature
                        );
                        break;
                    case 'questions': // questions API doesn't have a separate request & security object
                        assert.strictEqual(output.signature, testCase.signature);
                        break;
                    default:
                        assert.strictEqual(output.security.signature, testCase.signature);
                }
            });
        });

        after(() => LearnositySDK.enableTelemetry());
    });

    describe('request validation', () => {
        before(() => LearnositySDK.disableTelemetry()); // telemetry will affect request output

        testCases.forEach((testCase) => {
            it(`should generate the expected request object for ${testCase.service} ${ testCase.action ? testCase.action : ''}`, () => {
                const requestParams = getSDKParamsFor(testCase.service);
                const output = (new LearnositySDK()).init(
                    requestParams.service,
                    requestParams.security,
                    requestParams.secret,
                    requestParams.request,
                    testCase.action
                );

                if (testCase.service === 'data') {
                    assert.strictEqual(output.security, testCase.security);
                    assert.strictEqual(output.request, testCase.request);
                    assert.strictEqual(output.action, testCase.action);
                } else {
                    assert.strictEqual(JSON.stringify(output), testCase.outputString);
                }
            });
        });

        describe('passing the request as a string', () => {
            const testCases = [
                {
                    service: 'author',
                    expected: '{"security":{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","signature":"$02$ca2769c4be77037cf22e0f7a2291fe48c470ac6db2f45520a259907370eff861"},"request":"{\\"mode\\":\\"item_list\\",\\"config\\":{\\"item_list\\":{\\"item\\":{\\"status\\":true}}},\\"user\\":{\\"id\\":\\"walterwhite\\",\\"firstname\\":\\"walter\\",\\"lastname\\":\\"white\\"}}"}'
                },
                {
                    service: 'items',
                    expected: '{"security":{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","user_id":"$ANONYMIZED_USER_ID","signature":"$02$36c439e7d18f2347ce08ca4b8d4803a22325d54352650b19b6f4aaa521b613d9"},"request":"{\\"user_id\\":\\"$ANONYMIZED_USER_ID\\",\\"rendering_type\\":\\"assess\\",\\"name\\":\\"Items API demo - assess activity demo\\",\\"state\\":\\"initial\\",\\"activity_id\\":\\"items_assess_demo\\",\\"session_id\\":\\"demo_session_uuid\\",\\"type\\":\\"submit_practice\\",\\"config\\":{\\"configuration\\":{\\"responsive_regions\\":true},\\"navigation\\":{\\"scrolling_indicator\\":true},\\"regions\\":\\"main\\",\\"time\\":{\\"show_pause\\":true,\\"max_time\\":300},\\"title\\":\\"ItemsAPI Assess Isolation Demo\\",\\"subtitle\\":\\"Testing Subtitle Text\\"},\\"items\\":[\\"Demo3\\"]}"}'
                }
            ];

            testCases.forEach((testCase) => {
                it(`should generate the expected request object for ${testCase.service}`, () => {
                    const params = getSDKParamsFor(testCase.service);
                    const output = (new LearnositySDK()).init(
                        params.service,
                        params.security,
                        params.secret,
                        JSON.stringify(params.request)
                    );

                    assert.strictEqual(JSON.stringify(output), testCase.expected);
                });
            });
        });

        after(() => LearnositySDK.enableTelemetry());
    });
});
