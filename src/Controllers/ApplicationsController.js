"use strict";

var ApplicationsController,
    self,
    db,
    winston,
    Util,
    moment,
    loggerInstance;

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
    winston = require('winston');
    Util = require('../Util');
    moment = require('moment');
    loggerInstance = new (require('../Logging/Logger'))(app.NexusServer.config);
};

/**
 * Get a list of all applications
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.getIndex = function (req, res, next) {
    var applications,
        fiveAgo = moment().subtract(5, 'minutes').toDate();

    db.Application
        .findAll()
        .then(function (result) {
            applications = result;

            return db.InstancePing.findAll({
                where: {
                    updatedAt: {
                        gt: fiveAgo
                    }
                }
            });
        })
        .then(function (pings) {
            applications.forEach(function (application) {
                application.instanceCount = 0;

                pings.forEach(function (ping) {
                    if (ping.ApplicationId === application.id) {
                        application.instanceCount += 1;
                    }
                });
            });

            res.locals.applications = applications;
            res.render('applications/index');
        })
        .catch(function (error) {
            req.flash('errorMessages', ['Unable to retrieve applications']);
            res.render('applications/index');
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
        })
        .error(function (err) {
            req.flash('errorMessages', ['Unable to create application']);
            res.redirect('/apps/new');
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
    var application,
        availableFiles,
        files,
        grants,
        fiveAgo,
        instancePings;

    fiveAgo = moment().subtract(5, 'minutes').toDate();

    db.Application
        .find(Number(req.params.id))
        .then(function (existingApplication) {
            application = existingApplication;

            return db.sequelize.query('SELECT * FROM Files WHERE id NOT IN (SELECT `FileId` FROM Grants WHERE ApplicationId = :applicationId)', db.File, {}, { applicationId: application.id });
        })
        .then(function (configFiles) {
            availableFiles = configFiles;

            return db.File.findAll();
        })
        .then(function (configFiles) {
            files = configFiles;

            return application.getGrants();
        })
        .then(function (result) {
            grants = result;

            return db.InstancePing.findAll({
                where: {
                    ApplicationId: application.id,
                    updatedAt: {
                        gt: fiveAgo
                    }
                }
            });
        })
        .then(function (result) {
            instancePings = result;

            // Get logs (if any)
            return loggerInstance.all(String(application.id));
        })
        .then(function (instanceLogs) {
            console.log(instanceLogs);
            if (application === null) {
                req.flash('errorMessages', ['Unable to find the specified application']);
                res.redirect('/apps');
                return;
            }

            // Add filenames to grants for display
            grants.forEach(function (grant) {
                files.forEach(function (file) {
                    if (grant.FileId === file.id) {
                        grant.filename = file.name;
                    }
                });
            });

            // Make instance times prettier
            instancePings.forEach(function (ping) {
                ping.lastSeen = moment(ping.updatedAt).fromNow();

                ping.online = moment(ping.updatedAt).isAfter(moment().subtract(5, 'minutes'));
            });

            res.locals.files = availableFiles;
            res.locals.grants = grants;
            res.locals.application = application;
            res.locals.instancePings = instancePings;
            res.locals.instanceLogs = instanceLogs;

            res.render('applications/edit');
        })
        .catch(function (error) {
            req.flash('errorMessages', ['Unable to find the specified application']);
            res.redirect('/apps');

            winston.error(error);
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
                res.redirect('/apps/' + newApplication.id + '/edit');
                return;
            }

            // Persist to db
            newApplication
                .save()
                .success(function () {
                    req.flash('successMessages', ['Successfully updated application']);
                    res.redirect('/apps');
                })
                .error(function (err) {
                    req.flash('errorMessages', ['Unable to update application']);
                    res.redirect('/apps/new');
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
                return;
            }

            res.locals.application = application;
            res.render('applications/delete');
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified application']);
            res.redirect('/apps');
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
    var application;

    db.Application
        .find(Number(req.params.id))
        .then(function (existingApplication) {
            application = existingApplication;

            if (application === null) {
                req.flash('errorMessages', ['Unable to find the specified application']);
                res.redirect('/apps');

                throw new Error();
            }

            // Destroy all related grants
            return db.Grant.destroy({
                ApplicationId: application.id
            });
        })
        .then(function () {
            // Destroy all related tokens
            return db.ApplicationToken.destroy({
                ApplicationId: application.id
            });
        })
        .then(function () {
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
        .catch(function (error) {
            winston.error(error);
            req.flash('errorMessages', ['Unable to find the specified application']);
            res.redirect('/apps');
        });
};

/**
 * Get log
 *
 * @param req
 * @param res
 * @param next
 */
ApplicationsController.prototype.getLog = function (req, res, next) {
    db.Application
        .find(Number(req.params.id))
        .then(function (application) {
            if (application === null) {
                throw new Error();
            }

            res.locals.application = application;

            return loggerInstance.get(String(application.id), req.params.instance, req.params.filename);
        })
        .then(function (logContents) {
            res.locals.logContents = logContents;

            res.render('applications/logview');
        })
        .catch(function (error) {
            req.flash('errorMessages', ['Unable to find the specified application/log']);
            res.redirect('/apps');
        });
};

module.exports = ApplicationsController;