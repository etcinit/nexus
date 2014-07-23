"use strict";

var AuthController,
    auth;

/**
 * Authentication controller
 * @param app
 * @constructor
 */
AuthController = function (app)
{
    this.app = app;

    // Get a reference to the auth instance
    auth = app.NexusServer.auth;
};

/**
 * Get login form
 *
 * @param req
 * @param res
 * @param next
 */
AuthController.prototype.getLogin = function (req, res, next) {
    if (req.user) {
        res.redirect('/');
    }

    res.render('login');
};

/**
 * Attempt to login the user
 *
 * @param req
 * @param res
 * @param next
 * @returns {*|Function}
 */
AuthController.prototype.postLogin = function (req, res, next) {
    return auth.authenticate(req, res, next);
};

/**
 * Logout the user
 *
 * @param req
 * @param res
 * @param next
 */
AuthController.prototype.getLogout = function (req, res, next) {
    req.logout();
    res.redirect('/');
};

module.exports = AuthController;