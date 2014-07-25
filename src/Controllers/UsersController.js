"use strict";

var UsersController;

/**
 * Users controller
 *
 * @param app
 * @constructor
 */
UsersController = function (app) {
    this.app = app;
};

/**
 * Get list of users
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.getIndex = function (req, res, next) {
    return res.render('users/index');
};

/**
 * Get form for creating a new user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.getNew = function (req, res, next) {

};

/**
 * Handle the creation of a new user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.postNew = function (req, res, next) {

};

/**
 * Get form for editing an existing user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.getEdit = function (req, res, next) {

};

/**
 * Handle the update of an existing user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.postEdit = function (req, res, next) {

};

/**
 * Get confirmation dialog for deleting a user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.getDelete = function (req, res, next) {

};

/**
 * Handle the deletion of an existing user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.postDelete = function (req, res, next) {

};

module.exports = UsersController;