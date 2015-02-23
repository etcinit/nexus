'use strict';

/**
 * Class VersionMiddleware
 *
 * Publishes version information to views
 */
class VersionMiddleware
{
    /**
     * Handle request
     *
     * @param req
     * @param res
     * @param next
     */
    handle (req, res, next) {
        let server = container.make('NexusServer');

        res.locals.version = server.getVersion();

        next();
    }
}

module.exports = VersionMiddleware;
