'use strict';

let moment = require('moment');

let ValidationException = use('Validation/Exceptions/ValidationException'),
    Util = use('Util'),
    db = use('Models/index');

var TokensController;

/**
 * Tokens controller
 *
 * @constructor
 */
TokensController = function () {};

/**
 * Get a list of all tokens
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.getIndex = function (req, res, next) {
    var tokens,
        queryOptions = {};

    // Check whether we should show expired tokens
    if (req.query.expired === 'true') {
        queryOptions = {};

        res.locals.expiredShown = true;
    } else {
        queryOptions = {
            where: {
                expiration_date: {
                    gt: new Date()
                }
            }
        };

        res.locals.expiredShown = false;
    }

    db.ApplicationToken
        .findAll(queryOptions)
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
    let TokenManager = container.make('Api/TokenManager'),
        Logger = container.make('Logger');

    TokenManager
        .create(
            req.body.applicationId,
            Number(req.body.days),
            req.body.comment
        )
        .then(function () {
            req.flash('successMessages', ['Successfully generated new token']);
            res.redirect('/tokens');
        })
        .catch(function (err) {
            if (err instanceof ValidationException) {
                req.flash('errorMessages', err.getMessages());
            } else {
                req.flash('errorMessages', 'An error occurred');
                Logger.log(err);
            }

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
    let TokenManager = container.make('Api/TokenManager');

    TokenManager.find(req.params.id)
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
    let TokenManager = container.make('Api/TokenManager');

    TokenManager.revoke(req.params.id)
        .then(function () {
            req.flash('successMessages', ['Successfully revoked token']);
            res.redirect('/tokens');
        })
        .catch(function (err) {
            req.flash(
                'errorMessages',
                ['Unable to find/process the specified token']
            );
            res.redirect('/tokens');
        });
};

module.exports = TokensController;
