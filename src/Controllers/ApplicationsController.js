"use strict";

var ApplicationsController;

/**
 * Applications controller
 *
 * @param app
 * @constructor
 */
ApplicationsController = function (app) {
    this.app = app;
};

/**
 * Get a list of all applications
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.getIndex = function (req, res, next) {

};

/**
 * Get form for creating a new application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.getNew = function (req, res, next) {

};

/**
 * Handle the creation of a new application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.postNew = function (req, res, next) {

};

/**
 * Get the form for editing an application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.getEdit = function (req, res, next) {

};

/**
 * Handle the update of an existing application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.postEdit = function (req, res, next) {

};

/**
 * Get the confirmation dialog for deleting an application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.getDelete = function (req, res, next) {

};

/**
 * Handle the deletion of an application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.postDelete = function (req, res, next) {

};

module.exports = ApplicationsController;