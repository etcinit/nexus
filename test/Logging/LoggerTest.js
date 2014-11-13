"use strict";

var Logger = require('../../src/Logging/Logger'),
    path = require('path'),
    fs = require('fs-extra'),
    ensure = require('ensure.js'),
    testConfig;

testConfig = {
    appLogs: {
        dir: path.resolve(__dirname, '../../tmp/logs'),
        daily: false
    }
};

describe('Logger', function () {
    // Delete tmp dir before each test
    afterEach(function (done) {
        fs.remove(testConfig.appLogs.dir, function () {
            done();
        });
    });

    it('should be a constructor', function () {
        var instance = new Logger(testConfig);

        instance.should.be.instanceOf(Logger);
    });

    it('should create application dir in logs dir', function (done) {
        var instance = new Logger(testConfig),
            logPromise;

        logPromise = instance.log('01', 'instance-abcdef01', 'laravel.log', ['log line']);

        ensure.hasFunction(logPromise, 'then').should.be.true;

        logPromise.then(function () {
            fs.existsSync(path.resolve(testConfig.appLogs.dir, 'app01')).should.be.true;

            fs.existsSync(path.resolve(testConfig.appLogs.dir, 'app01/instance-abcdef01')).should.be.true;

            done();
        })
            .catch(done);
    });

    it('should write to the log file', function (done) {
        var instance = new Logger(testConfig),
            logPromise;

        logPromise = instance.log('01', 'instance-abcdef01', 'laravel.log', ['log line']);

        ensure.hasFunction(logPromise, 'then').should.be.true;

        logPromise.then(function () {
            var logFile = path.resolve(testConfig.appLogs.dir, 'app01/instance-abcdef01/laravel.log');
            fs.existsSync(logFile).should.be.true;

            fs.readFileSync(logFile, 'utf8')
                .should.be.equal("log line\n");

            done();
        })
            .catch(done);
    });

    it('should append to the log file if it exists', function (done) {
        var instance = new Logger(testConfig),
            logPromise;

        logPromise = instance.log('01', 'instance-abcdef01', 'laravel.log', ['log line']);

        ensure.hasFunction(logPromise, 'then').should.be.true;

        logPromise
            .then(function () {
                return instance.log('01', 'instance-abcdef01', 'laravel.log', ['log line']);
            })
            .then(function () {
                var logFile = path.resolve(testConfig.appLogs.dir, 'app01/instance-abcdef01/laravel.log');
                fs.existsSync(logFile).should.be.true;

                fs.readFileSync(logFile, 'utf8')
                    .should.be.equal("log line\nlog line\n");

                done();
            })
            .catch(done);
    });
});