"use strict";

var config;

/**
 * Default configuration file
 */
config = {
    port: 5000,
    db: {
        database: 'nexus',
        username: 'root',
        password: null,
        options: {
            dialect: 'sqlite',
            storage: 'nexus.db'
        },
        reset: false,
        createUser: false
    },
    sessionSecret: 'defaultSecret'
};

module.exports = config;