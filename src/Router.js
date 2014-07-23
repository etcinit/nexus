"use strict";

var Router,
    Util = require('./Util'),
    IndexController = require('./Controllers/IndexController'),
    AuthController = require('./Controllers/AuthController'),
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
        indexInstance,
        authInstance;

    // Setup route for static content
    this.app.use(express.static(Util.getRootPath() + '/public'));

    // Setup IndexController routes
    indexInstance = new IndexController(app);

    app.route('/')
        .get(indexInstance.getIndex);

    // Setup AuthController routes
    authInstance = new AuthController(app);

    app.route('/login')
        .get(authInstance.getLogin)
        .post(authInstance.postLogin);
};

module.exports = Router;