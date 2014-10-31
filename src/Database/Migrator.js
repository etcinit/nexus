"use strict";

var Migrator,

    fs = require('fs'),
    path = require('path'),

    db = require('../Models');

/**
 * Create a new instance of a database migrator
 *
 * @constructor
 */
Migrator = function () {
    this.migrator = db.sequelize.getMigrator({
        path: path.resolve(process.cwd(), 'migrations')
    });
};

/**
 * Run migrations
 *
 * @returns {*}
 */
Migrator.prototype.up = function () {
    return this.migrator.migrate();
};

/**
 * Rollback migrations
 *
 * @returns {*}
 */
Migrator.prototype.down = function () {
    return this.migrator.migrate({
        method: 'down'
    });
};

module.exports = Migrator;