"use strict";

var UsersController,
    Util,
    Auth,
    db;

/**
 * Users controller
 *
 * @param app
 * @constructor
 */
UsersController = function (app) {
    this.app = app;

    db = require('../Models');
    Util = require('../Util');
    Auth = require('../Auth');
};

/**
 * Get list of users
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.getIndex = function (req, res, next) {
    // Get ID of the currently logged in user
    var userId = req.user.values.id;

    db.User
        .findAll()
        .success(function (users) {
            users.forEach(function (user) {
                // Give the UI some info on what can be done on each user
                user.canDelete = true;
                user.canEdit = true;

                if (Number(user.id) === Number(userId)) {
                    user.canDelete = false;
                } else {
                    user.canEdit = false;
                }
            });

            res.locals.users = users;
            res.render('users/index');
        })
        .error(function (err) {
            req.flash('errorMessages', ['Unable to get users']);
            res.render('files/index');
        });
};

/**
 * Get form for creating a new user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.getNew = function (req, res, next) {
    return res.render('users/new');
};

/**
 * Handle the creation of a new user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.postNew = function (req, res, next) {
    var newUser,
        validationErrors;

    // Create user object
    newUser = db.User.build({
        username: req.body.username,
        password: req.body.password
    });

    // Validate
    validationErrors = Util.errorsToArray(newUser.validate());

    // Check that password confirmation matches
    if (req.body.password !== req.body.password_repeat) {
        validationErrors.push('Passwords must match');
    }

    // Show validation errors if any
    if (validationErrors.length > 0) {
        req.flash('errorMessages', validationErrors);
        res.redirect('/users/new');
        return;
    }

    // Persist in db
    Auth.hash(req.body.password)
        .then(function (hash) {
            newUser.password = hash;

            newUser.save()
                .success(function () {
                    req.flash('successMessages', ['Successfully created new user']);
                    res.redirect('/users');
                })
                .error(function () {
                    req.flash('errorMessages', ['Unable to create user. Check that the username is not taken.']);
                    res.redirect('/users/new');
                });
        });
};

/**
 * Get form for editing an existing user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.getEdit = function (req, res, next) {
    if (Number(res.locals.user.id) !== Number(req.params.id)) {
        req.flash('errorMessages', ['You cannot change other user passwords']);
        res.redirect('/users');
        return;
    }

    db.User
        .find(Number(req.params.id))
        .success(function (file) {
            if (file === null) {
                req.flash('errorMessages', ['Unable to find the specified user']);
                res.redirect('/users');
                return;
            }

            res.locals.file = file;
            res.render('users/edit');
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified user']);
            res.redirect('/users');
        });
};

/**
 * Handle the update of an existing user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.postEdit = function (req, res, next) {
    var validationErrors;

    if (Number(res.locals.user.id) !== Number(req.params.id)) {
        req.flash('errorMessages', ['You cannot change other user passwords']);
        res.redirect('/users');
        return;
    }

    db.User
        .find(req.params.id)
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified user']);
            res.redirect('/users');
        })
        .success(function (user) {
            // Collect input
            user.password = req.body.password;

            // Validate user
            validationErrors = Util.errorsToArray(user.validate());

            // Check that password confirmation matches
            if (req.body.password !== req.body.password_repeat) {
                validationErrors.push('Passwords must match');
            }

            // Show validation errors if any
            if (validationErrors.length > 0) {
                req.flash('errorMessages', validationErrors);
                res.redirect('/users/' + user.id + '/edit');
                return;
            }

            Auth
                .hash(req.body.password)
                .then(function (hash) {
                    user.password = hash;

                    // Persist in db
                    user
                        .save()
                        .success(function () {
                            req.flash('successMessages', ['Successfully updated user']);
                            res.redirect('/users');
                        })
                        .error(function (err) {
                            req.flash('errorMessages', ['Unable to update user']);
                            res.redirect('/users/' + user.id + '/edit');
                        });
                });
        });
};

/**
 * Get confirmation dialog for deleting a user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.getDelete = function (req, res, next) {
    if (Number(res.locals.user.id) === Number(req.params.id)) {
        req.flash('errorMessages', ['You cannot delete yourself']);
        res.redirect('/users');
        return;
    }

    db.User
        .find(Number(req.params.id))
        .success(function (user) {
            if (user === null) {
                req.flash('errorMessages', ['Unable to find the specified user']);
                res.redirect('/users');
                return;
            }

            res.locals.user = user;
            res.render('users/delete');
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified user']);
            res.redirect('/users');
        });
};

/**
 * Handle the deletion of an existing user
 *
 * @param req
 * @param res
 * @param next
 */
UsersController.prototype.postDelete = function (req, res, next) {
    if (Number(res.locals.user.id) === Number(req.params.id)) {
        req.flash('errorMessages', ['You cannot delete yourself']);
        res.redirect('/users');
        return;
    }

    db.User
        .find(Number(req.params.id))
        .success(function (user) {
            if (user === null) {
                req.flash('errorMessages', ['Unable to find the specified user']);
                res.redirect('/users');
                return;
            }

            user.destroy()
                .success(function () {
                    req.flash('successMessages', ['Successfully deleted user']);
                    res.redirect('/users');
                })
                .error(function (error) {
                    req.flash('errorMessages', ['Unable to delete user']);
                    res.redirect('/users/' + Number(req.params.id) + '/delete');
                });
        })
        .error(function (error) {
            req.flash('errorMessages', ['Unable to find the specified user']);
            res.redirect('/users');
        });
};

module.exports = UsersController;