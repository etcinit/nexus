"use strict";

var NexusServer,
    Router = require('./Router'),
    express = require('express');

/**
 * Nexus server
 *
 * @param config
 * @constructor
 */
NexusServer = function (config) {
    this.app = express();
    this.config = config;

    // Setup app routes
    this.router = new Router(this.app);
    this.router.init();
};

/**
 * Begin listening
 */
NexusServer.prototype.listen = function ()
{
    var server = this.app.listen(this.config.port || 3000, function () {
        console.log('Listening on port %d', server.address().port);
    });
};

module.exports = NexusServer;
