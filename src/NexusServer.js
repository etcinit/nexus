"use strict";

var NexusServer,
    Router = require('./Router'),
    Auth = require('./Auth'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    hoganExpress = require('hogan-express'),
    flash = require('connect-flash'),
    db = require('./Models'),
    q = require('q'),
    self;

/**
 * Nexus server
 *
 * @param config
 * @constructor
 */
NexusServer = function (config) {
    self = this;

    var app = this.app = express();

    // Keep reference to NexusServer
    app.NexusServer = this;

    // Keep reference to configuration file
    this.config = config;

    // Setup body parser

    // Parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // Parse application/json
    app.use(bodyParser.json());

    // Setup session
    app.use(session({
        secret: config.sessionSecret || 'defaultSecret'
    }));

    // Setup flash messages
    app.use(flash());

    app.use(function (req, res, next) {
        res.locals.successMessages = req.flash('successMessages');
        res.locals.errorMessages = req.flash('errorMessages');
        next();
    });

    // Setup authentication
    this.auth = new Auth(app);
    this.auth.setupPassport();

    // Setup view engine
    app.set('view engine', 'html');
    app.set('layout', 'layout');
    //app.enable('view cache');
    app.engine('html', hoganExpress);

    // Setup version info
    app.use(self.versionMiddleware);

    // Setup app routes
    this.router = new Router(app);
    this.router.init();
};

/**
 * Begin listening
 */
NexusServer.prototype.listen = function () {
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
NexusServer.prototype.connectToDb = function () {
    var deferred = q.defer(),
        self = this,
        config = this.config;

    db
        .sequelize
        .sync({ force: config.db.reset })
        .complete(function (err) {
            if (err) {
                deferred.reject(err);
            }

            if (config.db.createUser) {
                self.auth.createDefaultUser();
            }

            deferred.resolve();
        });

    return deferred.promise;
};

/**
 * Get version information of this server
 *
 * @returns {{major: number, minor: number, revision: number}}
 */
NexusServer.prototype.getVersion = function () {
    return {
        major: 0,
        minor: 1,
        revision: 0
    };
};

/**
 * Middleware for injecting version information
 *
 * @param req
 * @param res
 * @param next
 */
NexusServer.prototype.versionMiddleware = function (req, res, next) {
    res.locals.version = self.getVersion();

    next();
};

module.exports = NexusServer;
