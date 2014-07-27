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
GrantsController.prototype.getIndex = function (req, res, next) {
    return res.render('grants/index');
};

/**
 * Get form for creating a new grant
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.getNew = function (req, res, next) {
    return res.render('grants/new');
};

/**
 * Process the creation of a new grant
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.postNew = function (req, res, next) {

};

/**
 * Get confirmation dialog for deleting a grant
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.getDelete = function (req, res, next) {

};

/**
 * Process the deletion of a grant
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.postDelete = function (req, res, next) {

};

module.exports = GrantsController;