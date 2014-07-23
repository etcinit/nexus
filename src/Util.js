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

module.exports = Util;