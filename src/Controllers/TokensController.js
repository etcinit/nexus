"use strict";

var TokensController,
    Util,
    db;

/**
 * Tokens controller
 *
 * @param app
 * @constructor
 */
TokensController = function (app) {
    this.app = app;

    Util = require('../Util');
    db = require('../Models');
};

/**
 * Get a list of all tokens
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.getIndex = function (req, res, next) {
    db.ApplicationToken
        .findAll()
        .success(function (tokens) {
            res.locals.tokens = tokens;
            res.render('tokens/index');
        })
        .error(function (err) {
            req.flash('errorMessages', ['Unable to get tokens']);
            res.redirect('/');
        });
};

/**
 * Get form for creating a new token
 *
 * @param req
 * @param res
 * @param next
 */
TokensController.prototype.getNew = function (req, res, next) {
    db.Application
        .findAll()
        .success(function (applications) {
            if (applications.length < 1) {
                req.flash('errorMessages', ['There must be at least one application defined before creating a token']);
                res.redirect('/');
                return;
            }

            res.locals.applications = applications;
            res.render('tokens/new');
        })
        .error(function (err) {
            req.flash('errorMessages', ['There must be at least one application defined before creating a token']);
            res.redirect('/');
        });
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