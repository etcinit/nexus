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

module.exports = Logger;