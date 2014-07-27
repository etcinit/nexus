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

module.exports = Util;