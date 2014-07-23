"use strict";

var AuthController,
    auth;

AuthController = function (app)
{
    this.app = app;

    // Get a reference to the auth instance
    auth = app.NexusServer.auth;
};

AuthController.prototype.getLogin = function (req, res, next) {
    res.render('login');
};

AuthController.prototype.postLogin = function (req, res, next) {
    return auth.authenticate(req, res, next);
};

module.exports = AuthController;