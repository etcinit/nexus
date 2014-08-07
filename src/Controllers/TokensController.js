"use strict";

var TokensController,
    Util,
    db,
    moment;

/**
 * Tokens controller
 *
 * @param app
 * @constructor
 */
TokensController = function (app) {
    this.app = app;

    Util = require('../Util');
    db = require('../Models');
    moment = require('moment');
};

/**
 * Get a list of all tokens
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.getIndex = function (req, res, next) {
    var tokens;

    db.ApplicationToken
        .findAll()
        .then(function (tokenList) {
            tokens = tokenList;

            return db.Application.findAll();
        })
        .then(function (applications) {
            // Display the dates in a friendly way
            tokens.forEach(function (token) {
                var tokenDate = moment(token.expiration_date),
                    expired;

                // Get app info
                applications.forEach(function (application) {
                    if (application.id === token.ApplicationId) {
                        token.applicationName = application.name;
                    }
                });

                // Display expiration correctly
                if (tokenDate.isBefore(moment())) {
                    // Is expired
                    token.displayDate = 'Expired ' + tokenDate.fromNow();
                    token.valid = false;
                } else {
                    token.displayDate = 'Expires ' + tokenDate.fromNow();
                    token.valid = true;
                }
            });

            res.locals.tokens = tokens;
            res.render('tokens/index');
        })
        .catch(function (err) {
            req.flash('errorMessages', ['Unable to get tokens']);
            res.redirect('/');
        });
};

/**
 * Get form for creating a new token
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.getNew = function (req, res, next) {
    db.Application
        .findAll()
        .success(function (applications) {
            if (applications.length < 1) {
                req.flash('errorMessages', ['There must be at least one application defined before creating a token']);
                res.redirect('/');
                return;
            }

            res.locals.applications = applications;
            res.render('tokens/new');
        })
        .error(function (err) {
            req.flash('errorMessages', ['There must be at least one application defined before creating a token']);
            res.redirect('/');
        });
};

/**
 * Handle the creation of a new token
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.postNew = function (req, res, next) {
    var validationErrors = [];

    db.Application
        .findAll()
        .then(function (applications) {
            var appIds,
                newToken,
                expirationDate;

            console.log(applications);

            // Check there is at least one app
            if (applications.length < 1) {
                validationErrors.push('There must be at least on application defined before creating a token');
                throw new Error();
            }

            // Check expiration time is valid
            if (req.body.days < 1 || req.body.days > 30000) {
                validationErrors.push('Select a valid number of days (0-30000)');
                throw new Error();
            }

            // Calculate expiration date
            expirationDate = moment();
            expirationDate.add('days', req.body.days);

            // Collect input
            newToken = db.ApplicationToken.build({
                token: Util.randomToken(),
                comment: req.body.comment,
                ApplicationId: req.body.applicationId,
                expiration_date: expirationDate.toDate()
            });

            // Validate token
            validationErrors = Util.errorsToArray(newToken.validate());

            if (validationErrors.length > 0) {
                throw new Error();
            }

            return newToken.save();
        })
        .then(function () {
            req.flash('successMessages', ['Successfully generated new token']);
            res.redirect('/tokens');
        })
        .catch(function (err) {
            req.flash('errorMessages', validationErrors);
            res.redirect('/tokens');
        });
};

/**
 * Get the confirmation dialog for revoking a token
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.getRevoke = function (req, res, next) {
    db.ApplicationToken
        .find(req.params.id)
        .then(function (token) {
            res.locals.token = token;
            res.render('tokens/revoke');
        })
        .catch(function (err) {
            req.flash('errorMessages', ['Unable to find the specified token']);
            res.redirect('/tokens');
        });
};

/**
 * Handle the revocation of a token
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.postRevoke = function (req, res, next) {
    db.ApplicationToken
        .find(req.params.id)
        .then(function (token) {
            token.expiration_date = new Date();

            return token.save();
        })
        .then(function () {
            req.flash('successMessages', ['Successfully revoked token']);
            res.redirect('/tokens');
        })
        .catch(function (err) {
            req.flash('errorMessages', ['Unable to find/process the specified token']);
            res.redirect('/tokens');
        });
};

module.exports = TokensController;