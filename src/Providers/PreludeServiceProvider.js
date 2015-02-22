'use strict';

var ServiceProvider = use('Chromabits/Container/ServiceProvider');

/**
 * Provides the prelude
 *
 * @constructor
 */
class PreludeServiceProvider extends ServiceProvider
{
    /**
     * Register services
     *
     * @param app
     */
    register(app) {
        let instance = app.make('Prelude');

        app.instance('Prelude', instance);
    }

    /**
     * Boot the services
     *
     * @param app
     */
    boot(app) {
        let prelude = app.make('Prelude');

        prelude.run();
    }
}

module.exports = PreludeServiceProvider;
