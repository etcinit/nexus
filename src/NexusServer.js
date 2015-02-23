'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    hoganExpress = require('hogan-express'),
    flash = require('connect-flash'),
    q = require('q'),
    https = require('https'),
    winston = require('winston'),
    fs = require('fs'),
    path = require('path');

let Auth = use('Auth'),
    db = use('Models/index');

/**
 * Class NexusServer
 *
 * The main server class
 */
class NexusServer
{
    /**
     * Construct an instance of a NexusServer
     *
     * @param Config
     */
    constructor (Config)
    {
        var app = this.app = express();
        container.instance('ExpressApp', app);

        // Keep reference to NexusServer
        app.NexusServer = this;
        container.instance('NexusServer', this);

        // Keep reference to configuration file
        this.config = Config;

        // Setup logging
        this.setupLog();

        // Setup body parsers
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        // Setup session
        app.use(session({
            secret: this.config.sessionSecret || 'defaultSecret'
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
        app.use(container.make('Http/Middleware/VersionMiddleware').handle);

        // Setup app routes
        this.router = container.make('Router');
        this.router.init();
    }

    /**
     * Begin listening
     */
    listen () {
        var server,
            app = this.app,
            config = this.config;

        // Connect to database and start listening
        this.connectToDb().then(() => {
            if (config.https.enabled) {
                server = https
                    .createServer(config.https.options, app)
                    .listen(config.port || 3000, () => {
                        let port = server.address().port;

                        winston.info(`Listening on port ${port}`);
                });
            } else {
                server = app.listen(config.port || 3000, () => {
                    let port = server.address().port;

                    winston.info(`Listening on port ${port}`);
                });
            }
        }, (reason) => {
            winston.error(reason);
            throw reason;
        });
    }

    /**
     * Create database connection
     *
     * @returns {promise|Q.promise}
     */
    connectToDb () {
        var deferred = q.defer();

        db.sequelize
            .sync({ force: this.config.db.reset })
            .complete((err) => {
                if (err) {
                    deferred.reject(err);
                }

                if (this.config.db.createUser) {
                    this.auth.createDefaultUser();
                }

                deferred.resolve();
            });

        return deferred.promise;
    }

    /**
     * Get version information of this server
     *
     * @returns {{major: number, minor: number, revision: number}}
     */
    getVersion () {
        return {
            major: 0,
            minor: 5,
            revision: 0
        };
    }

    /**
     * Setup logging
     */
    setupLog () {
        var logDir = path.resolve('./logs'),
            logFile = path.resolve(logDir, 'nexus.log'),
            version = this.getVersion();

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
    }
}

module.exports = NexusServer;
