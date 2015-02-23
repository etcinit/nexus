'use strict';

let db = use('Models/index'),
    q = require('q'),
    bcrypt = require('bcrypt'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

/**
 * Class Auth
 *
 * Handles authentication in Nexus
 */
class Auth
{
    /**
     * Construct an instance of Auth
     *
     * @param ExpressApp
     */
    constructor (ExpressApp)
    {
        this.app = ExpressApp;
    }

    /**
     * Hash a password using bcrypt
     *
     * @param password
     * @returns {promise|Q.promise}
     */
    static hash (password)
    {
        var deferred = q.defer();

        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(hash);
        });

        return deferred.promise;
    }

    /**
     * Check if a password matches the hash
     *
     * @param password
     * @param hash
     * @returns {promise|Q.promise}
     */
    static compare (password, hash)
    {
        var deferred = q.defer();

        bcrypt.compare(password, hash, function (err, result) {
            if (err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(result);
        });

        return deferred.promise;
    }

    /**
     * Setup passport.js
     */
    setupPassport ()
    {
        this.app.use(passport.initialize());

        this.app.use(passport.session());

        this.app.use(this.middleware);

        passport.use(this.getStrategy());

        passport.serializeUser(this.serializeUser);
        passport.deserializeUser(this.deserializeUser);
    }

    /**
     * Get authentication strategy
     *
     * @returns {LocalStrategy}
     */
    getStrategy ()
    {
        let errorMessage = 'Invalid username/password combination';

        return new LocalStrategy(function (username, password, done) {
            db.User
                .find({
                    where: {
                        username: username
                    }
                })
                .success((user) => {
                    if (user === null) {
                        return done(null, false, {message: errorMessage});
                    }

                    Auth.compare(password, user.password)
                        .then((result) => {
                            if (result) {
                                done(null, user);
                            } else {
                                done(null, false, {message: errorMessage});
                            }
                        }, (reason) => {
                            done(null, false, {message: errorMessage});
                        });
                })
                .error((err) => {
                    done(false);
                });
        });
    }

    /**
     * Serialize user for session
     *
     * @param user
     * @param done
     */
    serializeUser (user, done)
    {
        done(null, user.id);
    }

    /**
     * Deserialize user from session
     *
     * @param id
     * @param done
     */
    deserializeUser (id, done)
    {
        db.User.find(id)
            .success((user) => {
                done(null, user);
            })
            .error((error) => {
                done(error);
            });
    }

    /**
     * Create a simple default user for initial setup
     */
    createDefaultUser ()
    {
        return Auth.hash('toor')
            .then((hash) => {
                return db.User.create({
                    username: 'root',
                    password: hash
                });
            });
    }

    authenticate (req, res, next)
    {
        passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    req.flash(
                        'errorMessages',
                        ['Invalid username/password combination']
                    );
                    return res.redirect('/login');
                }

                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }

                    res.redirect('/');
                });
            }
        )(req, res, next);
    }

    /**
     * Middleware for getting user information
     *
     * @param req
     * @param res
     * @param next
     */
    middleware (req, res, next)
    {
        if (req.user) {
            res.locals.user = req.user;
            res.locals.loggedIn = true;
        } else {
            res.locals.loggedOut = true;
        }

        next();
    }
}

module.exports = Auth;
