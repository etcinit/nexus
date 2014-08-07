"use strict";

var ApiController,
    Util,
    db,
    moment;

/**
 * Controller for the micro-API
 * @param app
 * @constructor
 */
ApiController =  function (app)
{
    this.app = app;

    db = require('../Models');
    Util = require('../Util');
    moment = require('moment');
};

/**
 * Show a basic message
 *
 * @param res
 * @param req
 * @param next
 */
ApiController.prototype.getIndex = function (req, res, next) {
    res.set('Content-Type', 'application/json');

    return res.send(JSON.stringify({
        status: 'success',
        messages: ['This is NexusConfig v1']
    }));
};

/**
 * GET /v1/fetch
 * Handles the only endpoint provided by this API
 *
 * @param res
 * @param req
 * @param next
 */
ApiController.prototype.getFetch = function (req, res, next) {
    var authorization,
        authorizationPrefix = 'Bearer ',
        authorizationKey,
        responseObject = {};

    res.set('Content-Type', 'application/json');

    // Check that the client provided an authorization header
    authorization = req.get('Authorization');
    if (authorization === undefined || !Util.beginsWith(authorizationPrefix, authorization)) {
        return res.send({
            status: 'error',
            errorMessages: ['Invalid authorization key']
        });
    }

    // Check that the key is valid
    authorizationKey = authorization.substr(authorizationPrefix.length);

    db.ApplicationToken.find({
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
    }).then(function (application) {
        responseObject.application = {
            name: application.name,
            description: application.description
        };

        // Fetch files
        return db.sequelize.query('SELECT Files.* FROM Files LEFT JOIN Grants on Grants.FileId = Files.id', db.File);
    }).then(function (files) {
        responseObject.files = {};

        files.forEach(function (file) {
            responseObject.files[file.name] = file.contents;
        });

        res.send(responseObject);
    }).catch(function (err) {
        console.log(err);
    });
};

module.exports = ApiController;