"use strict";

var Auth = require('./Auth'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    hoganExpress = require('hogan-express'),
    flash = require('connect-flash'),
    db = require('./Models'),
    q = require('q'),
    https = require('https'),
    winston = require('winston'),
    fs = require('fs'),
    path = require('path');

var NexusServer,
    self;

/**
 * Nexus server
 *
 * @param config
 * @constructor
 */
NexusServer = function (Config) {
    self = this;
    var config = Config;

    var app = this.app = express();
    container.instance('ExpressApp', app);

    // Keep reference to NexusServer
    app.NexusServer = this;
    container.instance('NexusServer', this);

    // Keep reference to configuration file
    this.config = config;

    // Setup logging
    this.setupLog();

    // Setup body parsers
    app.use(bodyParser.urlencoded({ extended: false }));
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
    this.auth = container.make('Auth');
    this.auth.setupPassport();
    container.instance('Auth', this.auth);

    // Setup view engine
    app.set('view engine', 'html');
    app.set('layout', 'layout');
    //app.enable('view cache');
    app.engine('html', hoganExpress);

    // Setup version info
    app.use(self.versionMiddleware);

    // Setup app routes
    this.router = container.make('Router');
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
            if (config.https.enabled) {
                server = https.createServer(config.https.options, app).listen(config.port || 3000, function () {
                    winston.info('Listening on port %d', server.address().port);
                });
            } else {
                server = app.listen(config.port || 3000, function () {
                    winston.info('Listening on port %d', server.address().port);
                });
            }
        }, function (reason) {
            winston.error(reason);
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
        minor: 4,
        revision: 2
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

/**
 * Setup logging
 */
NexusServer.prototype.setupLog = function () {
    var logDir = path.resolve('./logs'),
        logFile = path.resolve(logDir, 'nexus.log'),
        version = self.getVersion();

    if (!fs.existsSync(logDir)) {
        fs.mkdir(logDir);
    }

    //winston.add(winston.transports.File, { filename: logFile });
    //winston.remove(winston.transports.Console);

    winston.info([
        'Nexus Configuration Server v',
        version.major, '.', version.minor, '.', version.revision
    ].join(''));

    container.instance('Logger', winston);
};

module.exports = NexusServer;
