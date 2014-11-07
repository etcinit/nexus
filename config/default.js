"use strict";

var config;

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
    sessionSecret: 'defaultSecret',
    https: {
        enabled: false,
        options: {}
    }
};

if (process.env.DB_HOST) {
    config.db.host = process.env.DB_HOST;
}

module.exports = config;