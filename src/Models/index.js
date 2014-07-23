"use strict";

var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    lodash = require('lodash'),
    sequelize = new Sequelize('nexus', 'root', null, {
        dialect: 'sqlite',
        storage: 'nexus.db'
    }),
    db = {};

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