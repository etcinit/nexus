"use strict";

var Router,

    // Include other classes
    Util = require('./Util'),

    // Include controllers
    ApiController = require('./Controllers/ApiController'),
    ApplicationsController = require('./Controllers/ApplicationsController'),
    AuthController = require('./Controllers/AuthController'),
    FilesController = require('./Controllers/FilesController'),
    GrantsController = require('./Controllers/GrantsController'),
    IndexController = require('./Controllers/IndexController'),
    TokensController = require('./Controllers/TokensController'),
    UsersController = require('./Controllers/UsersController'),

    // Include dependencies
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
        auth = this.app.NexusServer.auth,
        apiInstance,
        applicationsInstance,
        authInstance,
        filesInstance,
        grantsInstance,
        indexInstance,
        tokensInstance,
        usersInstance;

    // Setup route for static content
    this.app.use(express.static(Util.getRootPath() + '/public'));

    // Setup ApiController routes
    apiInstance = new ApiController(app);

    app.route('/v1/')
        .get(apiInstance.getIndex);

    app.route('/v1/fetch')
        .get(apiInstance.getFetch);

    app.route('/v1/ping')
        .post(apiInstance.postPing);

    app.route('/v1/logs')
        .post(apiInstance.postLogs);

    // Setup ApplicationsController routes
    applicationsInstance = new ApplicationsController(app);

    app.route('/apps')
        .all(auth.protect)
        .get(applicationsInstance.getIndex);

    app.route('/apps/new')
        .all(auth.protect)
        .get(applicationsInstance.getNew)
        .post(applicationsInstance.postNew);

    app.route('/apps/:id/edit')
        .all(auth.protect)
        .get(applicationsInstance.getEdit)
        .post(applicationsInstance.postEdit);

    app.route('/apps/:id/delete')
        .all(auth.protect)
        .get(applicationsInstance.getDelete)
        .post(applicationsInstance.postDelete);

    app.route('/apps/:id/instance/:instance/logs/:filename')
        .all(auth.protect)
        .get(applicationsInstance.getLog);

    // Setup AuthController routes
    authInstance = new AuthController(app);

    app.route('/login')
        .get(authInstance.getLogin)
        .post(authInstance.postLogin);

    app.route('/logout')
        .get(authInstance.getLogout);

    // Setup FilesController routes
    filesInstance = new FilesController(app);

    app.route('/files')
        .all(auth.protect)
        .get(filesInstance.getIndex);

    app.route('/files/new')
        .all(auth.protect)
        .get(filesInstance.getNew)
        .post(filesInstance.postNew);

    app.route('/files/:id/edit')
        .all(auth.protect)
        .get(filesInstance.getEdit)
        .post(filesInstance.postEdit);

    app.route('/files/:id/delete')
        .all(auth.protect)
        .get(filesInstance.getDelete)
        .post(filesInstance.postDelete);

    // Setup GrantsController routes
    grantsInstance = new GrantsController(app);

    app.route('/grants')
        .all(auth.protect)
        .get(grantsInstance.getIndex);

    app.route('/grants/new')
        .all(auth.protect)
        .get(grantsInstance.getNew)
        .post(grantsInstance.postNew);

    app.route('/grants/:id/delete')
        .all(auth.protect)
        .get(grantsInstance.getDelete)
        .post(grantsInstance.postDelete);

    // Setup IndexController routes
    indexInstance = new IndexController(app);

    app.route('/')
        .get(indexInstance.getIndex);

    // Setup TokensController routes
    tokensInstance = new TokensController(app);

    app.route('/tokens')
        .all(auth.protect)
        .get(tokensInstance.getIndex);

    app.route('/tokens/new')
        .all(auth.protect)
        .get(tokensInstance.getNew)
        .post(tokensInstance.postNew);

    app.route('/tokens/:id/revoke')
        .all(auth.protect)
        .get(tokensInstance.getRevoke)
        .post(tokensInstance.postRevoke);

    // Setup UsersController
    usersInstance = new UsersController(app);

    app.route('/users')
        .all(auth.protect)
        .get(usersInstance.getIndex);

    app.route('/users/new')
        .all(auth.protect)
        .get(usersInstance.getNew)
        .post(usersInstance.postNew);

    app.route('/users/:id/edit')
        .all(auth.protect)
        .get(usersInstance.getEdit)
        .post(usersInstance.postEdit);

    app.route('/users/:id/delete')
        .all(auth.protect)
        .get(usersInstance.getDelete)
        .post(usersInstance.postDelete);

    // Setup error handlers
    app.use(indexInstance.getNotFound);

    //app.use(indexInstance.getServerError);
};

module.exports = Router;