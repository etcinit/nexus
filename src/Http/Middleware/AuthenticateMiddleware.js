'use strict';

/**
 * Class AuthenticateMiddleware
 *
 * Protects routes
 */
class AuthenticateMiddleware
{
    /**
     * Middleware for protecting routes
     *
     * @param req
     * @param res
     * @param next
     */
    handle (req, res, next)
    {
        if (req.user) {
            res.locals.user = req.user.values;
            return next();
        }

        res.redirect('/');
        next('route');
    }
}

module.exports = AuthenticateMiddleware;
