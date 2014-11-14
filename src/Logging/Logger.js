"use strict";

var Logger,

    path = require('path'),
    fs = require('fs'),
    Q = require('q'),
    mkdirp = require('mkdirp'),

    ensure = require('ensure.js'),
    shield = ensure.shield,
    Nothing = ensure.Nothing,
    Nullable = ensure.Nullable;

Logger = function (config) {
    ensure.requireIsNewThis(Logger, this);

    // Keep a reference to the configuration
    this.config = config;

    // Load config
    if (!ensure.has(this.config, 'appLogs')) {
        throw new Error('Application logging configuration not provided');
    }

    this.appLogsDir = this.config.appLogs.dir;
    this.appLogsDaily = ensure.one(this.config.appLogs.daily, true);
};

Logger.prototype.log = shield(
    [String, String, String, Array],
    Object,
    function (applicationId, instanceId, filename, lines) {
        var instanceDir,
            appDir,
            promise;

        // Check that the application directory exists
        appDir = path.resolve(this.appLogsDir, ['app', applicationId].join(''));
        instanceDir = path.resolve(appDir, instanceId);

        promise = Q.nfcall(mkdirp, instanceDir);

        promise = promise.then(function () {
            var contents = lines.join("\n") + "\n",
                filepath = path.resolve(instanceDir, filename);

            return Q.nfcall(fs.appendFile, filepath, contents);
        });

        return promise;
    }
);

Logger.prototype.has = shield([String], Object, function (applicationId) {
    var deferred,
        appDir;

    appDir = path.resolve(this.appLogsDir, ['app', applicationId].join(''));

    deferred = Q.defer();

    fs.exists(appDir, function (exists) {
        deferred.resolve(exists);
    });

    return deferred.promise;
});

Logger.prototype.getInstances = shield([String], Object, function (applicationId) {
    var promise,
        appDir;

    appDir = path.resolve(this.appLogsDir, ['app', applicationId].join(''));

    promise = Q.nfcall(fs.readdir, appDir)
        .then(function (files) {
            var instances = [],
                instanceChecks = [];

            files.forEach(function (file) {
                var deferred = Q.defer();

                instanceChecks.push(deferred.promise);

                fs.stat(path.resolve(appDir, file), function (err, stat) {
                    if (err) {
                        deferred.reject(err);
                    }

                    if (stat.isDirectory() && file !== '.' && file !== '..') {
                        instances.push(file);
                    }

                    deferred.resolve();
                });
            });

            return Q.all(instanceChecks)
                .then(function () {
                    return instances;
                });
        });

    return promise;
});

module.exports = Logger;