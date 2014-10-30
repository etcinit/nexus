"use strict";

var Auth,

    db = require('./Models'),
    q = require('q'),
    bcrypt = require('bcrypt'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

Auth = function (app) {
    this.app = app;
};

/**
 * Hash a password using bcrypt
 *
 * @param password
 * @returns {promise|Q.promise}
 */
Auth.hash = function (password) {
    var deferred = q.defer();

    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            deferred.reject(err);
            return;
        }

        deferred.resolve(hash);
    });

    return deferred.promise;
};

/**
 * Check if a password matches the hash
 *
 * @param password
 * @param hash
 * @returns {promise|Q.promise}
 */
Auth.compare = function (password, hash) {
    var deferred = q.defer();

    bcrypt.compare(password, hash, function (err, result) {
        if (err) {
            deferred.reject(err);
            return;
        }

        deferred.resolve(result);
    });

    return deferred.promise;
};

/**
 * Setup passport.js
 */
Auth.prototype.setupPassport = function () {
    this.app.use(passport.initialize());

    this.app.use(passport.session());

    this.app.use(this.middleware);

    passport.use(this.getStrategy());

    passport.serializeUser(this.serializeUser);
    passport.deserializeUser(this.deserializeUser);
};

/**
 * Get authentication strategy
 *
 * @returns {LocalStrategy}
 */
Auth.prototype.getStrategy = function () {
    return new LocalStrategy(function (username, password, done) {
        db.User
            .find({
                where: {
                    username: username
                }
            })
            .success(function (user) {
                if (user === null) {
                    done(null, false, {message: 'Invalid username/password combination'});
                    return;
                }

                Auth
                    .compare(password, user.password)
                    .then(function (result) {
                        if (result) {
                            done(null, user);
                        } else {
                            done(null, false, {message: 'Invalid username/password combination'});
                        }
                    }, function (reason) {
                        done(null, false, {message: 'Invalid username/password combination'});
                    });
            })
            .error(function (err) {
                done(false);
            });
    });
};

/**
 * Serialize user for session
 *
 * @param user
 * @param done
 */
Auth.prototype.serializeUser = function (user, done) {
    done(null, user.id);
};

/**
 * Deserialize user from session
 *
 * @param id
 * @param done
 */
Auth.prototype.deserializeUser = function (id, done) {
    db.User
        .find(id)
        .success(function (user) {
            done(null, user);
        })
        .error(function (error) {
            done(error);
        });
};

/**
 * Create a simple default user for initial setup
 */
Auth.prototype.createDefaultUser = function () {
    Auth.hash('toor')
        .then(function (hash) {
            db.User
                .create({
                    username: 'root',
                    password: hash
                });
        });
};

Auth.prototype.authenticate = function (req, res, next) {
    passport.authenticate(
        'local',
        function (err, user, info) {
            if (err) {
                next(err);
                return;
            }

            if (!user) {
                req.flash('errorMessages', ['Invalid username/password combination']);
                res.redirect('/login');
                return;
            }

            req.logIn(user, function (err) {
                if (err) {
                    next(err);
                    return;
                }

                res.redirect('/');
            });
        }
    )(req, res, next);
};

Auth.prototype.middleware = function (req, res, next) {
    if (req.user) {
        res.locals.user = req.user;
        res.locals.loggedIn = true;
    } else {
        res.locals.loggedOut = true;
    }

    next();
};

Auth.prototype.protect = function (req, res, next) {
    if (req.user) {
        res.locals.user = req.user.values;
        next();
        return;
    }

    res.redirect('/');
    next('route');
};

module.exports = Auth;