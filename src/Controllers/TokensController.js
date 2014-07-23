"use strict";

var TokensController;

/**
 * Tokens controller
 *
 * @param app
 * @constructor
 */
TokensController = function (app) {
    this.app = app;
};

/**
 * Get a list of all tokens
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.getIndex = function (req, res, next) {

};

/**
 * Get form for creating a new token
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.getNew = function (req, res, next) {

};

/**
 * Handle the creation of a new token
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.postNew = function (req, res, next) {

};

/**
 * Get the confirmation dialog for revoking a token
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.getRevoke = function (req, res, next) {

};

/**
 * Handle the revocation of a token
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.postRevoke = function (req, res, next) {

};

module.exports = TokensController;