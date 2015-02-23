'use strict';

let express = require('express');

let Util = use('Util');

/**
 * Class Router
 *
 * The main Nexus router
 */
class Router
{
    /**
     * Construct an instance of a Router
     *
     * @param ExpressApp
     * @param Auth
     */
    constructor (ExpressApp, Auth)
    {
        this.app = ExpressApp;
        this.auth = Auth;
    }

    /**
     * Create a router for handling application objects
     *
     * @returns {*}
     */
    createApplicationRouter ()
    {
        let router = express.Router(),
            controller = container
                .make('Http/Controllers/ApplicationsController'),
            protect = container.make('Http/Middleware/AuthenticateMiddleware');

        router.use(protect.handle);
        
        router.route('/').get(controller.getIndex);

        router.route('/new').get(controller.getNew).post(controller.postNew);

        router.route('/:id/edit')
            .get(controller.getEdit)
            .post(controller.postEdit);

        router.route('/:id/delete')
            .get(controller.getDelete)
            .post(controller.postDelete);

        router.route('/:id/instance/:instance/logs')
            .get(controller.getInstanceLogs);

        router.route('/:id/instance/:instance/logs/:filename')
            .get(controller.getLog);
        
        return router;
    }

    /**
     * Create a router for handling V1 API calls
     *
     * @returns {*}
     */
    createApiRouter ()
    {
        let router = express.Router(),
            controller = container.make('Http/Controllers/ApiController');

        router.route('/').get(controller.getIndex);
        router.route('/fetch').get(controller.getFetch);
        router.route('/ping').post(controller.postPing);
        router.route('/logs').post(controller.postLogs);

        return router;
    }

    /**
     * Create a router for handling authentication
     *
     * @returns {*}
     */
    createAuthRouter ()
    {
        let router = express.Router(),
            controller = container.make('Http/Controllers/AuthController');

        router.route('/login')
            .get(controller.getLogin)
            .post(controller.postLogin);

        router.route('/logout')
            .get(controller.getLogout);
        
        return router;
    }

    /**
     * Create a router for handling file objects
     *
     * @returns {*}
     */
    createFilesRouter ()
    {
        let router = express.Router(),
            controller = container.make('Http/Controllers/FilesController'),
            protect = container.make('Http/Middleware/AuthenticateMiddleware');

        router.use(protect.handle);

        router.route('/').get(controller.getIndex);

        router.route('/new')
            .get(controller.getNew)
            .post(controller.postNew);

        router.route('/:id/edit')
            .get(controller.getEdit)
            .post(controller.postEdit);

        router.route('/:id/delete')
            .get(controller.getDelete)
            .post(controller.postDelete);
        
        return router;
    }

    /**
     * Create a router for handling grant objects
     *
     * @returns {*}
     */
    createGrantsRouter ()
    {
        let router = express.Router(),
            controller = container.make('Http/Controllers/GrantsController'),
            protect = container.make('Http/Middleware/AuthenticateMiddleware');

        router.use(protect.handle);
        
        router.route('/').get(controller.getIndex);

        router.route('/new').get(controller.getNew).post(controller.postNew);

        router.route('/:id/delete')
            .get(controller.getDelete)
            .post(controller.postDelete);
        
        return router;
    }

    /**
     * Create a router for handling root routes
     *
     * @returns {*}
     */
    createIndexRouter ()
    {
        let router = express.Router(),
            controller = container.make('Http/Controllers/IndexController');

        router.route('/').get(controller.getIndex);

        return router;
    }

    /**
     * Create a router for handling token objects
     *
     * @returns {*}
     */
    createTokensRouter ()
    {
        let router = express.Router(),
            controller = container.make('Http/Controllers/TokensController'),
            protect = container.make('Http/Middleware/AuthenticateMiddleware');

        router.use(protect.handle);
        
        router.route('/').get(controller.getIndex);

        router.route('/new').get(controller.getNew).post(controller.postNew);

        router.route('/:id/revoke')
            .get(controller.getRevoke)
            .post(controller.postRevoke);

        return router;
    }

    /**
     * Create a router for handling user objects
     *
     * @returns {*}
     */
    createUsersRouter ()
    {
        let router = express.Router(),
            controller = container.make('Http/Controllers/UsersController'),
            protect = container.make('Http/Middleware/AuthenticateMiddleware');

        router.use(protect.handle);
        
        router.route('/').get(controller.getIndex);

        router.route('/new').get(controller.getNew).post(controller.postNew);

        router.route('/:id/edit')
            .get(controller.getEdit)
            .post(controller.postEdit);

        router.route('/:id/delete')
            .get(controller.getDelete)
            .post(controller.postDelete);

        return router;
    }

    /**
     * Initialize Nexus routes
     */
    init ()
    {
        // Alias app
        var app = this.app;

        // Setup route for static content
        this.app.use(express.static(Util.getRootPath() + '/public'));

        // Setup ApiController routes
        app.use('/v1', this.createApiRouter());
        app.use('/apps', this.createApplicationRouter());
        app.use('/', this.createAuthRouter());
        app.use('/files', this.createFilesRouter());
        app.use('/grants', this.createGrantsRouter());
        app.use('/', this.createIndexRouter());
        app.use('/tokens', this.createTokensRouter());
        app.use('/users', this.createUsersRouter());

        // Setup error handlers
        app.use(container.make('Http/Controllers/IndexController').getNotFound);
        //app.use(indexInstance.getServerError);
    }
}

module.exports = Router;
