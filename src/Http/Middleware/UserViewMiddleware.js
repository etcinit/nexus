'use strict';

/**
 * Class UserViewMiddleware
 *
 * Injects user information into the view context
 */
class UserViewMiddleware
{
    /**
     * Handle the request
     *
     * @param req
     * @param res
     * @param next
     */
    handle (req, res, next)
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
