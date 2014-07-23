"use strict";

var GrantsController;

GrantsController = function (app) {
    this.app = app;
};

/**
 * Get list of all grants made
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.getIndex = function (res, req, next) {

};

/**
 * Get form for creating a new grant
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.getNew = function (res, req, next) {

};

/**
 * Process the creation of a new grant
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.postNew = function (res, req, next) {

};

/**
 * Get confirmation dialog for deleting a grant
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.getDelete = function (res, req, next) {

};

/**
 * Process the deletion of a grant
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.postDelete = function (res, req, next) {

};

module.exports = GrantsController;