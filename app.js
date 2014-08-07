"use strict";

var NexusServer = require('./src/NexusServer.js'),
    config = require('./config/default.js'),
    server,
    argv = require('optimist').argv;

// Check if we need to rebuild the database
if (argv.rebuild) {
    console.log('INFO: Rebuilding database. All information will be removed');
    config.db.reset = true;
    config.db.createUser = true;
}

// Instantiate a new Nexus server and start listening
server = new NexusServer(config);
server.listen();