'use strict';

let argv = require('optimist').argv,
    winston = require('winston');

/**
 * Class Prelude
 *
 * Prepares the environment for the NexusServer
 */
class Prelude
{
    /**
     * Constructs an instance of a Prelude
     *
     * @param Config
     * @param Database_Migrator
     */
    constructor (Config, Database_Migrator)
    {
        this.config = Config;
        this.migrator = Database_Migrator;

        this.loadServer = true;
    }

    /**
     * Prepare the environment
     */
    run ()
    {
        // Check if we need to rebuild the database
        if (argv.rebuild) {
            winston.warn(
                'Rebuilding database. All information will be removed'
            );
            config.db.reset = true;
            config.db.createUser = true;
        }

        // Check if we need to setup the initial user
        if (argv.setup || process.env.SETUP === 'true') {
            config.db.createUser = true;
        }

        // Check if we are running migrations
        if (argv.migrate || process.env.MIGRATE === 'true') {
            winston.warn('Running migrations...');

            // Check if we are rolling back migrations
            if (argv.rollback) {
                this.migrator.down()
                    .success(() => {
                        winston.info('Successfully rolled back migrations!');
                    })
                    .error((error) => {
                        winston.error(
                            'Error while rolling back migrations',
                            error
                        );
                    });

                this.loadServer = false;
                return;
            }

            this.migrator.up()
                .success(() => {
                    winston.info('Successfully ran migrations!');
                })
                .error((error) => {
                    winston.error('Error while running migrations', error);
                });

            this.loadServer = false;
        }
    }

    /**
     * Returns whether or not the server should load
     *
     * @returns {bool}
     */
    shouldLoadServer ()
    {
        return this.loadServer;
    }
}

module.exports = Prelude;
