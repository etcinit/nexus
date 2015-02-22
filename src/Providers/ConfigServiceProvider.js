'use strict';

var ServiceProvider = use('Chromabits/Container/ServiceProvider'),
    Config = use('Config');

/**
 * Provides configuration services
 */
class ConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services
     *
     * @param app
     */
    register(app) {
        app.instance('Config', Config);
    }
}

module.exports = ConfigServiceProvider;
