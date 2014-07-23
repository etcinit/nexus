"use strict";

var NexusServer,
    Router = require('./Router'),
    express = require('express'),
    hoganExpress = require('hogan-express'),
    db = require('./Models'),
    q = require('q');

/**
 * Nexus server
 *
 * @param config
 * @constructor
 */
NexusServer = function (config) {
    var app = this.app = express();

    // Keep reference to configuration file
    this.config = config;

    // Setup view engine
    app.set('view engine', 'html');
    app.set('layout', 'layout');
    app.enable('view cache');
    app.engine('html', hoganExpress);

    // Setup app routes
    this.router = new Router(app);
    this.router.init();
};

/**
 * Begin listening
 */
NexusServer.prototype.listen = function ()
{
    var server,
        app = this.app,
        config = this.config;

    // Connect to database and start listening
    this
        .connectToDb()
        .then(function () {
            server = app.listen(config.port || 3000, function () {
                console.log('Listening on port %d', server.address().port);
            });
    }, function (reason) {
            throw reason;
        });
};

/**
 * Create database connection
 *
 * @returns {promise|Q.promise}
 */
NexusServer.prototype.connectToDb = function ()
{
    var deferred = q.defer();

    db
        .sequelize
        .sync({ force: true })
        .complete(function (err) {
            if (err) {
                deferred.reject(err);
            }

            deferred.resolve();
        });

    return deferred.promise;
};

module.exports = NexusServer;
