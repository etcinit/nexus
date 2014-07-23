"use strict";

var Router,
    Util = require('./Util'),
    express = require('express');

/**
 * Nexus router
 *
 * @param app
 * @constructor
 */
Router = function (app)
{
    this.app = app;
};

/**
 * Initialize Nexus routes
 */
Router.prototype.init = function ()
{
    // Setup route for static content
    this.app.use(express.static(Util.getRootPath() + '/public'));
};

module.exports = Router;