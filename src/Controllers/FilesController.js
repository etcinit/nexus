"use strict";

var FilesController,
    Util,
    db;

/**
 * Files controller
 *
 * @param app
 * @constructor
 */
FilesController = function (app) {
    this.app = app;

    db = require('../Models');
    Util = require('../Util');
};

/**
 * Get list of files available
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.getIndex = function (req, res, next) {
    db.File
        .findAll()
        .success(function (files) {
            res.locals.files = files;
            res.render('files/index');
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to get files']);
            res.render('files/index');
        });
};

/**
 * Get form for creating a new file
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.getNew = function (req, res, next) {
    return res.render('files/new');
};

/**
 * Handle the creation of a new post
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.postNew = function (req, res, next) {
    var newFile,
        validationErrors;

    // Collect input
    newFile = db.File.build({
        name: req.body.name,
        contents: req.body.contents
    });

    // Validate file
    validationErrors = Util.errorsToArray(newFile.validate());

    // Show validation errors if any
    if (validationErrors.length > 0) {
        req.flash('errorMessages', validationErrors);
        res.redirect('/files/new');
        return;
    }

    // Persist in db
    newFile.save()
        .success(function () {
            req.flash('successMessages', ['Successfully created new file']);
            res.redirect('/files');
        })
        .error(function () {
            req.flash('errorMessages', ['Unable to create file']);
            res.redirect('/files/new');
        });
};

/**
 * Get the form for editing an existing file
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.getEdit = function (req, res, next) {
    db.File
        .find(Number(req.params.id))
        .success(function (file) {
            if (file === null) {
                req.flash('errorMessages', ['Unable to find the specified file']);
                res.redirect('/files');
                return;
            }

            res.locals.file = file;
            res.render('files/edit');
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified file']);
            res.redirect('/files');
        });
};

/**
 * Handle the update of an existing file
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.postEdit = function (req, res, next) {
    var validationErrors;

    // Find application
    db.File
        .find(req.params.id)
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified file']);
            res.redirect('/files');
        })
        .success(function (file) {
            // Collect input
            file.name = req.body.name;
            file.contents = req.body.contents;

            // Validate file
            validationErrors = Util.errorsToArray(file.validate());

            // Show errors if validations failed
            if (validationErrors.length > 0) {
                req.flash('errorMessages', validationErrors);
                res.redirect('/files/' + file.id + '/edit');
                return;
            }

            // Persist to db
            file
                .save()
                .success(function () {
                    req.flash('successMessages', ['Successfully updated file']);
                    res.redirect('/files');
                })
                .error(function (err) {
                    req.flash('errorMessages', ['Unable to update file']);
                    res.redirect('/files/' + file.id + '/edit');
                });
        });
};

/**
 * Get the deletion confirmation dialog for a file
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.getDelete = function (req, res, next) {
    db.File
        .find(Number(req.params.id))
        .success(function (file) {
            if (file === null) {
                req.flash('errorMessages', ['Unable to find the specified file']);
                res.redirect('/files');
                return;
            }

            res.locals.file = file;
            res.render('files/delete');
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified file']);
            res.redirect('/files');
        });
};

/**
 * Handle the deletion of a file
 *
 * @param req
 * @param res
 * @param next
 */
FilesController.prototype.postDelete = function (req, res, next) {
    var file;

    db.File
        .find(Number(req.params.id))
        .then(function (existingFile) {
            file = existingFile;

            if (file === null) {
                req.flash('errorMessages', ['Unable to find the specified file']);
                res.redirect('/files');

                throw new Error();
            }

            return db.Grant.destroy({
                FileId: file.id
            });
        })
        .then(function () {
            file.destroy()
                .success(function () {
                    req.flash('successMessages', ['Successfully deleted file']);
                    res.redirect('/files');
                })
                .error(function (error) {
                    req.flash('errorMessages', ['Unable to delete file']);
                    res.redirect('/files/' + Number(req.params.id) + '/delete');
                });
        })
        .catch(function (error) {
            req.flash('errorMessages', ['Unable to find the specified file']);
            res.redirect('/files');
        });
};

module.exports = FilesController;