'use strict';

var ServiceProvider = use('Chromabits/Container/ServiceProvider'),
    NexusServer = use('NexusServer'),
    Router = use('Router');

/**
 * Provides the main server service
 *
 * @constructor
 */
class ServerServiceProvider extends ServiceProvider
{
    register(app) {
        app.bind('NexusServer', NexusServer);

        app.bind('Router', Router)
    }
}

module.exports = ServerServiceProvider;
