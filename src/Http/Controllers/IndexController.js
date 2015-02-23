'use strict';

/**
 * Class IndexController
 *
 * Handles core pages in the application
 */
class IndexController
{
    /**
     * Get the home page of the application
     *
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    getIndex(req, res, next) {
        // Redirect to application list if logged in
        if (req.user) {
            res.redirect('/apps');
            return;
        }

        return res.render('index');
    }

    /**
     * Get 404 page
     *
     * @param req
     * @param res
     * @param next
     */
    getNotFound(req, res, next) {
        res.status(404);

        res.render('errors/notFound');
    }

    /**
     * Get 500 page
     *
     * @param req
     * @param res
     * @param next
     */
    getServerError(req, res, next) {
        res.send(500, 'Error :(');
    }
}

module.exports = IndexController;
