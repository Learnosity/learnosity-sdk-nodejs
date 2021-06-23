'use strict';

const assert = require('assert');
const LearnositySDK = require('../index');
const {getSDKParamsFor} = require('./fixtures/requests');

describe('init function', () => {
    const testCases = [
        {
            service: 'assess',
            signature: '03f4869659eeaca81077785135d5157874f4800e57752bf507891bf39c4d4a90',
            outputString: '{"items":[{"content":"<span class=\\"learnosity-response question-demoscience1234\\"></span>","response_ids":["demoscience1234"],"workflow":"","reference":"question-demoscience1"},{"content":"<span class=\\"learnosity-response question-demoscience5678\\"></span>","response_ids":["demoscience5678"],"workflow":"","reference":"question-demoscience2"}],"ui_style":"horizontal","name":"Demo (2 questions)","state":"initial","metadata":{},"navigation":{"show_next":true,"toc":true,"show_submit":true,"show_save":false,"show_prev":true,"show_title":true,"show_intro":true},"time":{"max_time":600,"limit_type":"soft","show_pause":true,"warning_time":60,"show_time":true},"configuration":{"onsubmit_redirect_url":"/assessment/","onsave_redirect_url":"/assessment/","idle_timeout":true,"questionsApiVersion":"v2"},"questionsApiActivity":{"user_id":"$ANONYMIZED_USER_ID","type":"submit_practice","state":"initial","id":"assessdemo","name":"Assess API - Demo","questions":[{"response_id":"demoscience1234","type":"sortlist","description":"In this question, the student needs to sort the events, chronologically earliest to latest.","list":["Russian Revolution","Discovery of the Americas","Storming of the Bastille","Battle of Plataea","Founding of Rome","First Crusade"],"instant_feedback":true,"feedback_attempts":2,"validation":{"valid_response":[4,3,5,1,2,0],"valid_score":1,"partial_scoring":true,"penalty_score":-1}},{"response_id":"demoscience5678","type":"highlight","description":"The student needs to mark one of the flowers anthers in the image.","img_src":"http://www.learnosity.com/static/img/flower.jpg","line_color":"rgb(255, 20, 0)","line_width":"4"}],"consumer_key":"yis0TYCu7U9V4o7M","timestamp":"20140626-0528","signature":"03f4869659eeaca81077785135d5157874f4800e57752bf507891bf39c4d4a90"},"type":"activity"}'
        },
        {
            service: 'author',
            signature: '108b985a4db36ef03905572943a514fc02ed7cc6b700926183df7babc2cd1c96',
            outputString: '{"security":{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","signature":"108b985a4db36ef03905572943a514fc02ed7cc6b700926183df7babc2cd1c96"},"request":{"mode":"item_list","config":{"item_list":{"item":{"status":true}}},"user":{"id":"walterwhite","firstname":"walter","lastname":"white"}}}'
        },
        {
            service: 'data',
            signature: 'e1eae0b86148df69173cb3b824275ea73c9c93967f7d17d6957fcdd299c8a4fe',
            security: '{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","signature":"e1eae0b86148df69173cb3b824275ea73c9c93967f7d17d6957fcdd299c8a4fe"}',
            request: '{"limit":100}',
            action: 'get'
        },
        {
            service: 'data',
            signature: '18e5416041a13f95681f747222ca7bdaaebde057f4f222083881cd0ad6282c38',
            security: '{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","signature":"18e5416041a13f95681f747222ca7bdaaebde057f4f222083881cd0ad6282c38"}',
            request: '{"limit":100}',
            action: 'post'
        },
        {
            service: 'items',
            signature: '82edaf80c2abb55c7a78d089f5b6f89393e621ef4a85150489ac2cfdd6a32f9a',
            outputString: '{"security":{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","user_id":"$ANONYMIZED_USER_ID","signature":"82edaf80c2abb55c7a78d089f5b6f89393e621ef4a85150489ac2cfdd6a32f9a"},"request":{"user_id":"$ANONYMIZED_USER_ID","rendering_type":"assess","name":"Items API demo - assess activity demo","state":"initial","activity_id":"items_assess_demo","session_id":"demo_session_uuid","type":"submit_practice","config":{"configuration":{"responsive_regions":true},"navigation":{"scrolling_indicator":true},"regions":"main","time":{"show_pause":true,"max_time":300},"title":"ItemsAPI Assess Isolation Demo","subtitle":"Testing Subtitle Text"},"items":["Demo3"]}}'
        },
        {
            service: 'questions',
            signature: '03f4869659eeaca81077785135d5157874f4800e57752bf507891bf39c4d4a90',
            outputString: '{"consumer_key":"yis0TYCu7U9V4o7M","timestamp":"20140626-0528","user_id":"$ANONYMIZED_USER_ID","signature":"03f4869659eeaca81077785135d5157874f4800e57752bf507891bf39c4d4a90","type":"local_practice","state":"initial","questions":[{"response_id":"60005","type":"association","stimulus":"Match the cities to the parent nation.","stimulus_list":["London","Dublin","Paris","Sydney"],"possible_responses":["Australia","France","Ireland","England"],"validation":{"valid_responses":[["England"],["Ireland"],["France"],["Australia"]]}}]}'
        },
        {
            service: 'reports',
            signature: '91085beccf57bf0df77c89df94d1055e631b36bc11941e61460b445b4ed774bc',
            outputString: '{"security":{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","signature":"91085beccf57bf0df77c89df94d1055e631b36bc11941e61460b445b4ed774bc"},"request":{"reports":[{"id":"report-1","type":"sessions-summary","user_id":"$ANONYMIZED_USER_ID","session_ids":["AC023456-2C73-44DC-82DA28894FCBC3BF"]}]}}'
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
                            output.security.match(/"signature":"(\w+)"/)[1],
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
                    expected: '{"security":{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","signature":"108b985a4db36ef03905572943a514fc02ed7cc6b700926183df7babc2cd1c96"},"request":"{\\"mode\\":\\"item_list\\",\\"config\\":{\\"item_list\\":{\\"item\\":{\\"status\\":true}}},\\"user\\":{\\"id\\":\\"walterwhite\\",\\"firstname\\":\\"walter\\",\\"lastname\\":\\"white\\"}}"}'
                },
                {
                    service: 'items',
                    expected: '{"security":{"consumer_key":"yis0TYCu7U9V4o7M","domain":"localhost","timestamp":"20140626-0528","user_id":"$ANONYMIZED_USER_ID","signature":"82edaf80c2abb55c7a78d089f5b6f89393e621ef4a85150489ac2cfdd6a32f9a"},"request":"{\\"user_id\\":\\"$ANONYMIZED_USER_ID\\",\\"rendering_type\\":\\"assess\\",\\"name\\":\\"Items API demo - assess activity demo\\",\\"state\\":\\"initial\\",\\"activity_id\\":\\"items_assess_demo\\",\\"session_id\\":\\"demo_session_uuid\\",\\"type\\":\\"submit_practice\\",\\"config\\":{\\"configuration\\":{\\"responsive_regions\\":true},\\"navigation\\":{\\"scrolling_indicator\\":true},\\"regions\\":\\"main\\",\\"time\\":{\\"show_pause\\":true,\\"max_time\\":300},\\"title\\":\\"ItemsAPI Assess Isolation Demo\\",\\"subtitle\\":\\"Testing Subtitle Text\\"},\\"items\\":[\\"Demo3\\"]}"}'
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
