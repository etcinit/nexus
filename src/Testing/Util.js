"use strict";

// Set testing env
process.env.NODE_ENV = 'testing';

var Util,

    config = require('../Config'),
    Auth = require('../Auth'),
    db = require('../Models'),
    auth,

    Q = require('q'),
    moment = require('moment');

/**
 * Testing utilities class
 *
 * @constructor
 */
Util = function () {
    this.testAppId = null;
    this.testAppToken = '';
};

/**
 * Setup the testing database
 *
 * @returns {*}
 */
Util.prototype.setupDb = function () {
    var self = this;

    auth = new Auth(this.getMockApp());

    return db.sequelize
        .sync({ force: true })
        .then(function () {
            // Create default user
            return auth.createDefaultUser();
        })
        .then(function () {
            // Create a testing app
            return db.Application.create({
                name: 'TestingApp',
                description: 'Testing application'
            });
        })
        .then(function (testApp) {
            // Keep track of app id
            self.testAppId = testApp.id;
            self.testAppToken = 'TESTINGTOKEN';

            // Create an access token
            return db.ApplicationToken.create({
                token: 'TESTINGTOKEN',
                comment: 'Testing token',
                ApplicationId: testApp.id,
                expiration_date: moment().add(30, 'days').toDate()
            });
        });
};

/**
 * Get a mock app
 *
 * @returns {{}}
 */
Util.prototype.getMockApp = function () {
    var mockApp = {};

    mockApp.NexusServer = {
        config: config
    };

    return mockApp;
};

Util.prototype.getTestingAppId = function () {
    return this.testAppId;
};

Util.prototype.getTestingToken = function () {
    return this.testAppToken;
};

module.exports = Util;