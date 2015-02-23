'use strict';

let legit = require('legit.js');

let ValidationRule = legit.ValidationRule;

/**
 * Class CleanFilenameRule
 */
class CleanFilenameRule extends ValidationRule
{
    /**
     * Perform validation check
     *
     * @param value
     * @param fields
     * @param property
     * @returns {boolean}
     */
    execute (value, fields, property)
    {
        if (value.match(/^[a-zA-Z0-9\+\-\_\.\,]+$/) === null) {
            return false;
        }

        if (value === '..' || value === '.') {
            return false;
        }

        return true;
    }

    /**
     * Get a custom error message for this rule
     *
     * @param fieldName
     * @returns {string}
     */
    getMessage (fieldName) {
        return fieldName + ' should only have the following characters a-z, A-Z, 0-9, ., ,,';
    }
}

module.exports = CleanFilenameRule;
