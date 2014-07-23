"use strict";

var IndexController;

/**
 * IndexController
 *
 * Manage main page of the application
 *
 * @constructor
 */
IndexController = function () {

};

IndexController.prototype.getIndex = function (req, res, next) {
    // Redirect to application list if logged in
    if (req.user) {
        res.redirect('/apps');
        return;
    }

    return res.render('index');
};

IndexController.prototype.getNotFound = function (req, res, next) {
    res.status(404);

    res.render('errors/notFound');
};

IndexController.prototype.getServerError = function (req, res, next) {
    res.send(500, 'Error :(');
};

module.exports = IndexController;