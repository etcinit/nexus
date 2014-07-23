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

module.exports = IndexController;