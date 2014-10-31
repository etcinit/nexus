"use strict";

var NexusServer = require('./src/NexusServer'),
    Migrator = require('./src/Database/Migrator'),
    config = require('./src/Config'),

    argv = require('optimist').argv,
    winston = require('winston'),

    server,
    migrator;

// Check if we need to rebuild the database
if (argv.rebuild) {
    winston.warn('Rebuilding database. All information will be removed');
    config.db.reset = true;
    config.db.createUser = true;
}

// Check if we need to setup the initial user
if (argv.setup) {
    config.db.createUser = true;
}

// Check if we are running migrations
if (argv.migrate) {
    winston.warn('Running migrations...');

    migrator = new Migrator();

    // Check if we are rolling back migrations
    if (argv.rollback) {
        migrator.down()
            .success(function () {
                winston.info('Successfully rolled back migrations!');
            })
            .error(function (error) {
                winston.error('Error while rolling back migrations', error);
            });

        return;
    }

    migrator.up()
        .success(function () {
            winston.info('Successfully ran migrations!');
        })
        .error(function (error) {
            winston.error('Error while running migrations', error);
        });

    return;
}

// Instantiate a new Nexus server and start listening
server = new NexusServer(config);
server.listen();