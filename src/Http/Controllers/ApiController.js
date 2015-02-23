"use strict";

let moment = require('moment'),
    winston = require('winston'),
    q = require('q'),
    legit = require('legit.js');

let Util = use('Util'),
    CleanFilenameRule = use('Validation/CleanFilenameRule'),
    db = use('Models/index');

let loggerInstance;

/**
 * Class ApiController
 *
 * Controller for the micro-API
 */
class ApiController
{
    /**
     * Constructs an instance of an ApiController
     *
     * @param Logger
     */
    constructor (Logger)
    {
        loggerInstance = Logger;
    }

    /**
     * Show a basic message
     *
     * @param res
     * @param req
     * @param next
     */
    getIndex (req, res, next)
    {
        res.set('Content-Type', 'application/json');

        return res.send(JSON.stringify({
            status: 'success',
            messages: ['This is NexusConfig v1']
        }));
    }

    /**
     * GET /v1/fetch
     * Handles the only endpoint provided by this API
     *
     * @param res
     * @param req
     * @param next
     */
    getFetch (req, res, next)
    {
        var responseObject = {};

        authMiddleware(req, res)
            .then(function (application) {
                responseObject.application = {
                    id: application.id,
                    name: application.name,
                    description: application.description
                };

                // Fetch files
                return db.sequelize.query(
                    'SELECT Files.*, Grants.alias FROM Files LEFT JOIN Grants on Grants.FileId = Files.id ' +
                    'WHERE Grants.ApplicationId = :applicationId',
                    null,
                    {raw: true},
                    {applicationId: application.id}
                );
            }).then(function (tableRows) {
                responseObject.files = {};

                tableRows.forEach(function (file) {
                    if (file.alias !== '') {
                        responseObject.files[file.alias] = file.contents;
                    } else {
                        responseObject.files[file.name] = file.contents;
                    }
                });

                responseObject.status = 'success';

                res.send(responseObject);
            }).catch(function (err) {
                winston.error(err);
            });
    }

    /**
     * POST /v1/ping
     * Handles the ping endpoint
     *
     * @param req
     * @param res
     * @param next
     */
    postPing (req, res, next)
    {
        var responseObject = {},
            pingValidator;

        // Create a validator for this request
        pingValidator = new legit.Validator({
            name: [
                new legit.RequiredRule(),
                new legit.TypeRule(String),
                new legit.MinMaxLengthRule(1, 100)
            ],

            message: [
                new legit.RequiredRule(),
                new legit.TypeRule(String),
                new legit.MinMaxLengthRule(1, 255)
            ]
        });

        authMiddleware(req, res)
            .then(function (application) {
                var instancePing;

                // Validate request
                pingValidator.validate(req.body);

                return db.InstancePing.find({
                    where: {
                        instanceName: req.body.name,
                        ApplicationId: application.id
                    }
                })
                    .then(function (foundInstance) {
                        if (foundInstance) {
                            foundInstance.message = req.body.message;

                            return foundInstance.save()
                                .success(function () {
                                    // Tell the client that everything went fine
                                    res.send({
                                        status: 'success'
                                    });
                                });
                        } else {
                            // Create object and save in db
                            return db.InstancePing
                                .build({
                                    instanceName: req.body.name,
                                    message: req.body.message,
                                    ApplicationId: application.id
                                })
                                .save()
                                .then(function () {
                                    // Tell the client that everything went fine
                                    res.send({
                                        status: 'success'
                                    });
                                })
                                .catch(function (error) {
                                    throw error;
                                });
                        }
                    })
                    .catch(function (error) {
                        throw error;
                    });
            }).catch(function (error) {
                if (error instanceof legit.ValidationError) {
                    res.status(401).send({
                        status: 'error',
                        errorMessages: ['Input validation failed'],
                        validationErrors: error.getMessages()
                    });

                    return;
                }

                winston.error(error);

                res.status(500).send({
                    status: 'error',
                    errorMessages: ['Internal server error']
                });
            });
    }

    /**
     * POST /v1/logs
     * Handles publishing logs from instances into Nexus
     *
     * @param req
     * @param res
     * @param next
     */
    postLogs (req, res, next)
    {
        var responseObject = {},
            logsValidator;

        // Create a validator for this request
        logsValidator = new legit.Validator({
            filename: [
                new legit.RequiredRule(),
                new legit.TypeRule(String),
                new legit.MinMaxLengthRule(1, 100),
                new CleanFilenameRule()
            ],

            instanceName: [
                new legit.RequiredRule(),
                new legit.TypeRule(String),
                new legit.MinMaxLengthRule(1, 100),
                new CleanFilenameRule()
            ],

            lines: [
                new legit.RequiredRule(),
                new legit.TypeRule(Array)
            ]
        });

        authMiddleware(req, res)
            .then(function (application) {
                // Validate request
                logsValidator.validate(req.body);

                return loggerInstance.log(
                    String(application.id),
                    req.body.instanceName,
                    req.body.filename,
                    req.body.lines
                )
                    .then(function () {
                        // Tell the client that everything went fine
                        res.send({
                            status: 'success'
                        });
                    });
            }).catch(function (error) {
                if (error instanceof legit.ValidationError) {
                    res.status(401).send({
                        status: 'error',
                        errorMessages: ['Input validation failed'],
                        validationErrors: error.getMessages()
                    });

                    return;
                }

                winston.error(error);

                res.status(500).send({
                    status: 'error',
                    errorMessages: ['Internal server error']
                });
            });
    }
}

function authMiddleware(req, res) {
    var authorization,
        authorizationPrefix = 'Bearer ',
        authorizationKey,
        responseObject = {},
        deferred = q.defer();

    res.set('Content-Type', 'application/json');

    // Check that the client provided an authorization header
    authorization = req.get('Authorization');
    if (authorization === undefined || !Util.beginsWith(authorizationPrefix, authorization)) {
        res.send({
            status: 'error',
            errorMessages: ['Invalid authorization key']
        });

        deferred.reject(new Error('Invalid authorization key'));
        return deferred.promise;
    }

    // Check that the key is valid
    authorizationKey = authorization.substr(authorizationPrefix.length);

    return db.ApplicationToken.find({
        where: {
            token: authorizationKey
        }
    }).then(function (token) {
        if (token === null) {
            // The key is invalid, show error
            res.send({
                status: 'error',
                errorMessages: ['Invalid authorization key']
            });

            throw new Error();
        }

        // Check if the token has expired
        if (moment(token.expiration_date).isBefore(moment())) {
            // The key is invalid, show error
            res.send({
                status: 'error',
                errorMessages: ['Expired authorization key']
            });

            throw new Error();
        }

        // Otherwise, fetch app info
        responseObject.status = 'success';
        return db.Application.find(token.ApplicationId);
    });
}

module.exports = ApiController;
