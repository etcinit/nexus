'use strict';

let fs = require('fs'),
    path = require('path'),
    sinon = require('sinon');

let ApiController = use('Http/Controllers/ApiController'),
    TestingUtil = use('Testing/Util');

describe('ApiController', function () {
    before(function (done) {
        let testUtil = new TestingUtil();

        // Setup database
        testUtil.setupDb()
            .then(function () {
                done();
            });
    });

    it('should be a constructor function', function () {
        var instance = new ApiController({}, {});

        instance.should.be.instanceOf(ApiController);
    });

    describe('#getIndex', function () {
        it('should return a successful response', function () {
            // Build mocks
            var serverMock = {
                getVersion: sinon.stub().returns('version_1')
            };
            var resMock = {
                send: sinon.spy(),
                set: sinon.spy()
            };

            // Create the controller and run the handler
            var instance = new ApiController({}, serverMock);
            instance.getIndex({}, resMock, {});

            // Perform assertions
            serverMock.getVersion.calledOnce.should.be.true;
            resMock.send.calledOnce.should.be.true;
            JSON.parse(resMock.send.args[0][0]).status
                .should.be.equal('success');
        });
    });

    //describe('#postLogs', function () {
    //    var instance = new ApiController(mockApp),
    //        reqMock,
    //        resMock;
    //
    //    before(function () {
    //        resMock = {
    //            send: sinon.spy(),
    //            set: sinon.spy(),
    //            status: function () {
    //                return resMock;
    //            }
    //        };
    //
    //        reqMock = {
    //            body: {
    //                filename: 'testapp.log',
    //                instanceName: 'testing-abcdef123',
    //                applicationId: testUtil.getTestingAppId(),
    //                lines: [
    //                    'my log line 1',
    //                    'my log line 2'
    //                ]
    //            }
    //        };
    //
    //        reqMock.get = sinon.stub();
    //        reqMock.get.withArgs('Authorization').returns('Bearer ' + testUtil.getTestingToken());
    //    });
    //
    //    it('should return a successful response', function (done) {
    //        resMock.send = function (content) {
    //            if (content.status) {
    //                content.status.should.be.equal('success');
    //            }
    //
    //            done();
    //        };
    //
    //        instance.postLogs(reqMock, resMock, {});
    //    });
    //
    //    it('should return write to logs file', function (done) {
    //        resMock.send = function (content) {
    //            fs.existsSync(path.resolve(testConfig.appLogs.dir, 'app' + testUtil.getTestingAppId())).should.be.true;
    //
    //            done();
    //        };
    //
    //        instance.postLogs(reqMock, resMock, {});
    //    });
    //});
});


