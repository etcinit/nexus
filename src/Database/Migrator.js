"use strict";

var fs = require('fs'),
    path = require('path'),

    db = require('../Models');

/**
 * Class Migrator
 *
 * Runs migrations
 */
class Migrator
{
    /**
     * Create a new instance of a Migrator
     *
     * @constructor
     */
    constructor() {
        this.migrator = db.sequelize.getMigrator({
            path: path.resolve(process.cwd(), 'migrations')
        });
    }

    /**
     * Run migrations
     *
     * @returns {*}
     */
    up() {
        return this.migrator.migrate();
    }

    /**
     * Rollback migrations
     *
     * @returns {*}
     */
    down() {
        return this.migrator.migrate({
            method: 'down'
        });
    }
}

module.exports = Migrator;
