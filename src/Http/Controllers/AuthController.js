'use strict';

var auth;

/**
 * Class AuthController
 *
 * Handles user authentication
 */
class AuthController
{
    /**
     * Create an instance of an AuthController
     *
     * @param Auth
     */
    constructor (Auth)
    {
        auth = Auth;
    }

    /**
     * Get login form
     *
     * @param req
     * @param res
     * @param next
     */
    getLogin (req, res, next)
    {
        if (req.user) {
            return res.redirect('/');
        }

        res.render('login');
    }

    /**
     * Attempt to login the user
     *
     * @param req
     * @param res
     * @param next
     * @returns {*|Function}
     */
    postLogin (req, res, next)
    {
        return auth.authenticate(req, res, next);
    }

    /**
     * Logout the user
     *
     * @param req
     * @param res
     * @param next
     */
    getLogout (req, res, next) {
        req.logout();
        res.redirect('/');
    }
}

module.exports = AuthController;
