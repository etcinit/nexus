'use strict';

/**
 * Class App
 *
 * The entry point of the application
 */
class App
{
    /**
     * Construct an instance of an App
     *
     * @param Prelude
     */
    constructor (Prelude)
    {
        this.prelude = Prelude;
    }

    /**
     * Run the app
     */
    main ()
    {
        this.prelude.run();

        // Instantiate a new Nexus server and start listening
        if (this.prelude.shouldLoadServer()) {
            container.make('NexusServer').listen();
        }
    }
}

module.exports = App;
