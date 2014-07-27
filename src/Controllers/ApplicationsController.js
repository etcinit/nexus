"use strict";

var ApplicationsController,
    self,
    db,
    Util;

/**
 * Applications controller
 *
 * @param {NexusServer} app
 * @constructor
 */
ApplicationsController = function (app) {
    self = this;
    this.app = app;
    db = require('../Models');
    Util = require('../Util');
};

/**
 * Get a list of all applications
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.getIndex = function (req, res, next) {
    db.Application
        .findAll()
        .success(function (applications) {
            res.locals.applications = applications;
            res.render('applications/index');
            next();
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to retrieve applications']);
            res.render('applications/index');
            next();
        });
};

/**
 * Get form for creating a new application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.getNew = function (req, res, next) {
    return res.render('applications/new');
};

/**
 * Handle the creation of a new application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.postNew = function (req, res, next) {
    var newApplication,
        validationErrors;

    // Collect input
    newApplication = db.Application.build({
        name: req.body.name,
        description: req.body.description
    });

    // Validate application
    validationErrors = Util.errorsToArray(newApplication.validate());

    // Show errors if validations failed
    if (validationErrors.length > 0) {
        req.flash('errorMessages', validationErrors);
        res.redirect('/apps/new');
        return;
    }

    // Persist to db
    newApplication
        .save()
        .success(function () {
            req.flash('successMessages', ['Successfully created new application']);
            res.redirect('/apps');
            next();
        })
        .error(function (err) {
            req.flash('errorMessages', ['Unable to create application']);
            res.redirect('/apps/new');
            next();
        });
};

/**
 * Get the form for editing an application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.getEdit = function (req, res, next) {
    db.Application
        .find(Number(req.params.id))
        .success(function (application) {
            if (application === null) {
                req.flash('errorMessages', ['Unable to find the specified application']);
                res.redirect('/apps');
                next();
                return;
            }

            res.locals.application = application;
            res.render('applications/edit');
            next();
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified application']);
            res.redirect('/apps');
            next();
        });
};

/**
 * Handle the update of an existing application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.postEdit = function (req, res, next) {
    var newApplication,
        validationErrors;

    // Find application
    db.Application
        .find(req.params.id)
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified application']);
            res.redirect('/apps');
            next();
        })
        .success(function (application) {
            // Collect input
            newApplication = application;

            application.name = req.body.name;
            application.description = req.body.description;

            // Validate application
            validationErrors = Util.errorsToArray(newApplication.validate());

            // Show errors if validations failed
            if (validationErrors.length > 0) {
                req.flash('errorMessages', validationErrors);
                res.redirect('/apps/new');
                return;
            }

            // Persist to db
            newApplication
                .save()
                .success(function () {
                    req.flash('successMessages', ['Successfully updated application']);
                    res.redirect('/apps');
                    next();
                })
                .error(function (err) {
                    req.flash('errorMessages', ['Unable to update application']);
                    res.redirect('/apps/new');
                    next();
                });
        });
};

/**
 * Get the confirmation dialog for deleting an application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.getDelete = function (req, res, next) {
    db.Application
        .find(Number(req.params.id))
        .success(function (application) {
            if (application === null) {
                req.flash('errorMessages', ['Unable to find the specified application']);
                res.redirect('/apps');
                next();
                return;
            }

            res.locals.application = application;
            res.render('applications/delete');
            next();
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified application']);
            res.redirect('/apps');
            next();
        });
};

/**
 * Handle the deletion of an application
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.postDelete = function (req, res, next) {
    db.Application
        .find(Number(req.params.id))
        .success(function (application) {
            if (application === null) {
                req.flash('errorMessages', ['Unable to find the specified application']);
                res.redirect('/apps');
                next();
                return;
            }

            application.destroy()
                .success(function () {
                    req.flash('successMessages', ['Successfully deleted application']);
                    res.redirect('/apps');
                })
                .error(function (error) {
                    req.flash('errorMessages', ['Unable to delete application']);
                    res.redirect('/apps/' + Number(req.params.id) + '/delete');
                });
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified application']);
            res.redirect('/apps');
            next();
        });
};

module.exports = ApplicationsController;