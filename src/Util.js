"use strict";

var Util,
    path = require('path');

/**
 * Nexus utility classes
 *
 * @constructor
 */
Util = function () {

};

/**
 * Get a path to the root of application
 *
 * @returns {string}
 */
Util.getRootPath = function ()
{
    return path.resolve(__dirname + '/../');
};

/**
 * Parses sequelize errors into a mustache.js friendly array
 *
 * @param errors
 */
Util.errorsToArray = function (errors) {
    var errorsArray = [],
        i;

    for (i in errors) {
        if (errors.hasOwnProperty(i)) {
            errors[i].forEach(function (message) {
                errorsArray.push(message);
            });
        }
    }

    return errorsArray;
};

/**
 * Generate a random token
 *
 * @returns {string}
 */
Util.randomToken = function () {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        result = '';

    for( var i=0; i < 64; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
};

/**
 * Checks if the subject string begins with prefix
 *
 * @param prefix
 * @param subject
 * @returns {boolean}
 */
Util.beginsWith = function (prefix, subject) {
    if (subject.length < prefix.length) {
        return false;
    }

    var subString = subject.substr(0, prefix.length);

    return subString === prefix;
};

module.exports = Util;