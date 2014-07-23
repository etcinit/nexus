"use strict";

var Router,
    Util = require('./Util'),
    IndexController = require('./Controllers/IndexController'),
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
    var app = this.app,
        indexInstance;

    // Setup route for static content
    this.app.use(express.static(Util.getRootPath() + '/public'));

    // Setup IndexController routes
    indexInstance = new IndexController(this.app);

    app.route('/')
        .get(indexInstance.getIndex);
};

module.exports = Router;