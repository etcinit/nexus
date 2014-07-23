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
    return res.render('index');
};

IndexController.prototype.getNotFound = function (req, res, next) {
    res.send(404, "Can't find that");
};

module.exports = IndexController;