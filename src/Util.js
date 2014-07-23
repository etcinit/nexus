"use strict";

var Util;

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
    return __dirname + '/../';
};

module.exports = Util;