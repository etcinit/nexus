'use strict';

let path = require('path');

/**
 * Class Util
 *
 * Utility functions for Nexus
 */
class Util
{
    /**
     * Get a path to the root of application
     *
     * @returns {string}
     */
    static getRootPath ()
    {
        return path.resolve(__dirname + '/../');
    }

    /**
     * Parses sequelize errors into a mustache.js friendly array
     *
     * @param errors
     */
    static errorsToArray (errors)
    {
        var errorsArray = [];

        for (var i in errors) {
            if (errors.hasOwnProperty(i)) {
                errors[i].forEach(function (message) {
                    errorsArray.push(message);
                });
            }
        }

        return errorsArray;
    }

    /**
     * Generate a random token
     *
     * @returns {string}
     */
    static randomToken ()
    {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                + 'abcdefghijklmnopqrstuvwxyz0123456789',
            result = '';

        for (let i = 0; i < 64; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    }

    /**
     * Checks if the subject string begins with prefix
     *
     * @param prefix
     * @param subject
     * @returns {boolean}
     */
    static beginsWith (prefix, subject) {
        if (subject.length < prefix.length) {
            return false;
        }

        let subString = subject.substr(0, prefix.length);

        return subString === prefix;
    }
}

module.exports = Util;
