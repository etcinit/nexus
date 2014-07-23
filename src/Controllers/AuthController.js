"use strict";

var AuthController;

AuthController = function (app)
{
    this.app = app;
};

AuthController.prototype.getLogin = function (req, res, next) {
    res.render('login');
};

AuthController.prototype.postLogin = function (req, res, next) {

};

module.exports = AuthController;