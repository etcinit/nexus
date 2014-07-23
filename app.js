"use strict";

var NexusServer = require('./src/NexusServer.js'),
    config = require('./config/default.js'),
    server;

// Instantiate a new Nexus server and start listening
server = new NexusServer(config);
server.listen();

