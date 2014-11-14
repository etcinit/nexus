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

    describe('#log', function () {
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

    describe('#has', function () {
        it('should return false if no app has been logged', function (done) {
            var instance = new Logger(testConfig);

            instance.has('01')
                .then(function (result) {
                    result.should.be.false;
                })
                .then(function () {
                    done();
                })
                .catch(function (reason) {
                    done(reason);
                });
        });

        it('should return true if the app has been logged', function (done) {
            var instance = new Logger(testConfig),
                logPromise;

            logPromise = instance.log('01', 'instance-abcdef01', 'laravel.log', ['log line']);

            ensure.hasFunction(logPromise, 'then').should.be.true;

            logPromise
                .then(function () {
                    return instance.log('01', 'instance-abcdef01', 'laravel.log', ['log line']);
                })
                .then(function () {
                    return instance.has('01');
                })
                .then(function (result) {
                    result.should.be.true;
                })
                .then(function () {
                    done();
                })
                .catch(function (reason) {
                    done(reason);
                });
        });
    });

    describe('#getInstances', function () {
        it('should return a list of instances for an app', function (done) {
            var instance = new Logger(testConfig),
                logPromise;

            logPromise = instance.log('01', 'instance-abcdef01', 'laravel.log', ['log line']);

            ensure.hasFunction(logPromise, 'then').should.be.true;

            logPromise
                .then(function () {
                    return instance.log('01', 'instance-abcdef02', 'laravel.log', ['log line']);
                })
                .then(function () {
                    return instance.getInstances('01');
                })
                .then(function (instances) {
                    ensure(instances, Array);

                    ensure.isIn('instance-abcdef01', instances).should.be.true;
                    ensure.isIn('instance-abcdef02', instances).should.be.true;

                    done();
                })
                .catch(done);
        });
    });

    describe('#getFilenames', function () {
        it('should return a list of logs for an instance', function (done) {
            var instance = new Logger(testConfig),
                logPromise;

            logPromise = instance.log('01', 'instance-abcdef01', 'app.log', ['log line']);

            ensure.hasFunction(logPromise, 'then').should.be.true;

            logPromise
                .then(function () {
                    return instance.log('01', 'instance-abcdef01', 'database.log', ['log line']);
                })
                .then(function () {
                    return instance.getFilenames('01', 'instance-abcdef01');
                })
                .then(function (filenames) {
                    ensure(filenames, Array);

                    ensure.isIn('app.log', filenames).should.be.true;
                    ensure.isIn('database.log', filenames).should.be.true;

                    done();
                })
                .catch(done);
        });
    });

    describe('#get', function () {
        it('should get the specified log', function (done) {
            var instance = new Logger(testConfig),
                logPromise;

            logPromise = instance.log('01', 'instance-abcdef01', 'laravel.log', ['log line']);

            ensure.hasFunction(logPromise, 'then').should.be.true;

            logPromise.then(function () {
                var logFile = path.resolve(testConfig.appLogs.dir, 'app01/instance-abcdef01/laravel.log');

                return instance.get('01', 'instance-abcdef01', 'laravel.log');
            })
                .then(function (result) {
                    result.should.be.equal("log line\n");

                    done();
                })
                .catch(done);
        });
    });
});