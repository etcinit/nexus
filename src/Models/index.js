"use strict";

var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    Config = require('../Config'),
    lodash = require('lodash'),
    winston = require('winston'),
    sequelize,
    sequelizeOptions,
    db = {};

/**
 * Setup options for sequelize
 */
sequelizeOptions = lodash.extend({
    logging: winston.info
}, Config.db.options);

/**
 * Initialize Sequelize instance
 *
 * @type {Sequelize}
 */
sequelize = new Sequelize(
    Config.db.database,
    Config.db.username,
    Config.db.password,
    sequelizeOptions
);

// Dynamically load models
fs
    .readdirSync(__dirname)
    .filter(function (file) {
        // Exclude this file from the list
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));

        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);