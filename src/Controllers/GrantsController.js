"use strict";

var GrantsController,
    Util,
    db;

GrantsController = function (app) {
    this.app = app;

    db = require('../Models');
    Util = require('../Util');
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
    db.Grant.count({
        where: {
            ApplicationId: req.body.applicationId,
            FileId: req.body.fileId
        }
    }).then(function (grantCount) {
        // Check if a grant for this file-app association already exists
        if (grantCount > 0) {
            req.flash(
                'errorMessages',
                ['Unable to create new grant. A grant for this file and application already exists']
            );

            res.redirect('/apps/');

            throw new Error();
        }

        return db.File.count({
            where: {
                id: req.body.fileId
            }
        });
    }).then(function (fileCount) {
        if (fileCount < 1) {
            throw new Error('File does not exists');
        }

        return db.Application.count({
            where: {
                id: req.body.applicationId
            }
        });
    }).then(function (applicationCount) {
        if (applicationCount < 1) {
            throw new Error('Application does not exist');
        }

        // Otherwise, create the grant
        var newGrant = db.Grant.build({
            ApplicationId: req.body.applicationId,
            FileId: req.body.fileId,
            alias: req.body.alias || ''
        });

        return newGrant.save();
    }).then(function () {
        req.flash('successMessages', ['Successfully created new grant']);
        res.redirect('/apps/' + req.body.applicationId + '/edit');
    }).catch(function (err) {
        req.flash('errorMessages', ['Unable to create new grant']);
        res.redirect('/apps/');
    });
};

/**
 * Get confirmation dialog for deleting a grant
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.getDelete = function (req, res, next) {
    var grant,
        grantFile;

    db.Grant.find(req.params.id)
        .then(function (existingGrant) {
            grant = existingGrant;

            if (grant === null) {
                // Not found
                throw new Error('Unable to find the specified grant');
            }

            return db.File.find(grant.FileId);
        })
        .then(function (file) {
            grantFile = file;

            return db.Application.find(grant.ApplicationId);
        })
        .then(function (application) {
            res.locals.application = application;
            res.locals.file = grantFile;
            res.locals.grant = grant;

            res.render('grants/delete');
        })
        .catch(function (err) {
            req.flash('errorMessages', ['Unable to find the specified grant']);
            res.redirect('/apps');
        });
};

/**
 * Process the deletion of a grant
 *
 * @param res
 * @param req
 * @param next
 */
GrantsController.prototype.postDelete = function (req, res, next) {
    var grant;

    db.Grant.find(req.params.id)
        .then(function (existingGrant) {
            grant = existingGrant;

            if (grant === null) {
                // Not found
                throw new Error('Unable to find the specified grant');
            }

            return grant.destroy();
        })
        .then(function () {
            req.flash('successMessages', ['Successfully revoked grant']);
            res.redirect('/apps/' + grant.ApplicationId + '/edit');
        })
        .catch(function (err) {
            req.flash('errorMessages', ['Unable to find the specified grant']);
            res.redirect('/apps');
        });
};

module.exports = GrantsController;