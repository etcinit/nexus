"use strict";

var Logger;

var path = require('path'),
    fs = require('fs'),
    Q = require('q'),
    mkdirp = require('mkdirp'),
    sf = require('slice-file'),
    ensure = require('ensure.js');

var shield = ensure.shield,
    Nothing = ensure.Nothing,
    Nullable = ensure.Nullable;

Logger = function (Config) {
    ensure.requireIsNewThis(Logger, this);

    // Keep a reference to the configuration
    this.config = Config;

    // Load config
    if (!ensure.has(this.config, 'appLogs')) {
        throw new Error('Application logging configuration not provided');
    }

    this.appLogsDir = this.config.appLogs.dir;
    this.appLogsDaily = ensure.one(this.config.appLogs.daily, true);
};

/**
 * Log
 *
 * @param applicationId
 * @param instanceId
 * @param filename
 * @param lines
 */
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

/**
 * Check if logs for a certain application exist
 *
 * @param applicationId
 */
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

/**
 * Get list of instances
 *
 * @param applicationId
 */
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

/**
 * Get filenames for an instance
 *
 * @param applicationId
 * @param instanceName
 */
Logger.prototype.getFilenames = shield([String, String], Object, function (applicationId, instanceName) {
    var promise,
        instanceDir;

    instanceDir = path.resolve(this.appLogsDir, ['app', applicationId].join(''), instanceName);

    promise = Q.nfcall(fs.readdir, instanceDir)
        .then(function (files) {
            var filenames = [],
                filenameChecks = [];

            files.forEach(function (file) {
                var deferred = Q.defer();

                filenameChecks.push(deferred.promise);

                fs.stat(path.resolve(instanceDir, file), function (err, stat) {
                    if (err) {
                        deferred.reject(err);
                    }

                    if (!stat.isDirectory() && file !== '.' && file !== '..') {
                        filenames.push(file);
                    }

                    deferred.resolve();
                });
            });

            return Q.all(filenameChecks)
                .then(function () {
                    return filenames;
                });
        });

    return promise;
});

/**
 * Get a specific log file
 *
 * @param applicationId
 * @param instanceName
 * @param filename
 * @param tail
 */
Logger.prototype.get = shield(
    [String, String, String, Nullable(Number)],
    Object,
    function (applicationId, instanceName, filename, tail) {
        var deferred,
            promise,
            filePath;

        filePath = path.resolve(this.appLogsDir, ['app', applicationId].join(''), instanceName, filename);

        deferred = Q.defer();

        fs.exists(filePath, function (exists) {
            deferred.resolve(exists);
        });

        promise = deferred.promise
            .then(function (exists) {
                var tailFile,
                    tailDeferred;

                if (!exists) {
                    throw new Error('Log does not exist');
                }

                if (tail) {
                    tailFile = sf(filePath);

                    console.log(tailFile);

                    tailDeferred = Q.defer();

                    tailFile.slice(-(tail), function (err, lines) {
                        if (err) {
                            tailDeferred.reject(err);
                            return;
                        }

                        console.log('lines', lines);

                        tailDeferred.resolve(lines.join(''));
                    });

                    return tailDeferred.promise;
                }

                return Q.nfcall(fs.readFile, filePath, 'utf8');
            })
            .then(function (fileContents) {
                return fileContents;
            });

        return promise;
    }
);

Logger.prototype.all = shield([String], Object, function (applicationId) {
    var instanceLogs = [],
        self = this;

    return this.has(applicationId)
        .then(function (hasLogs) {
            if (!hasLogs) {
                return instanceLogs;
            }

            return self.getInstances(applicationId)
                .then(function (instances) {
                    var filenameTasks = [];

                    instances.forEach(function (instance) {
                        filenameTasks.push(
                            self.getFilenames(applicationId, instance)
                                .then(function (filenames) {
                                    instanceLogs.push({
                                        instanceName: instance,
                                        files: filenames
                                    });
                                })
                        );
                    });

                    return Q.all(filenameTasks)
                        .then(function () {
                            return instanceLogs;
                        });
                });
        });
});

module.exports = Logger;
