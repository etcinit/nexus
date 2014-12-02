"use strict";

var config,

    path = require('path');

/**
 * Default configuration file
 */
config = {
    port: process.env.PORT || 5000,
    db: {
        database: process.env.DB_NAME || 'nexus',
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || null,
        options: {
            dialect: process.env.DB_DIALECT || 'sqlite',
            storage: 'nexus.db'
        },
        reset: false,
        createUser: false
    },
    sessionSecret: process.env.SESSION_SECRET || 'defaultSecret',
    https: {
        enabled: false,
        options: {}
    },
    appLogs: {
        dir: path.resolve(__dirname, '../logs'),
        daily: true
    }
};

if (process.env.DB_HOST) {
    config.db.options.host = process.env.DB_HOST;
}

if (process.env.DB_PORT) {
    config.db.options.port = process.env.DB_PORT;
}

module.exports = config;
