"use strict";

var FilesController;

/**
 * Files controller
 *
 * @param app
 * @constructor
 */
FilesController = function (app) {
    this.app = app;
};

/**
 * Get list of files available
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.getIndex = function (req, res, next) {
    return res.render('files/index');
};

/**
 * Get form for creating a new file
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.getNew = function (req, res, next) {

};

/**
 * Handle the creation of a new post
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.postNew = function (req, res, next) {

};

/**
 * Get the form for editing an existing file
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.getEdit = function (req, res, next) {

};

/**
 * Handle the update of an existing file
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.postEdit = function (req, res, next) {

};

/**
 * Get the deletion confirmation dialog for a file
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.getDelete = function (req, res, next) {

};

/**
 * Handle the deletion of a file
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.postDelete = function (req, res, next) {

};

module.exports = FilesController;