"use strict";

var CleanFilenameRule,

    legit = require('legit.js');

CleanFilenameRule = function () {
    // Call parent constructor
    legit.ValidationRule.call(this, arguments);
};

CleanFilenameRule.prototype = new legit.ValidationRule();

// The execute method performs the validation check.
// It is expected that it returns true if the field is valid. False, otherwise.
CleanFilenameRule.prototype.execute = function (value, fields, property) {
    if (value.match(/^[a-zA-Z0-9\+\-\_\.\,]+$/) === null) {
        return false;
    }

    if (value === '..' || value === '.') {
        return false;
    }

    return true;
};

// (Optional) Get a custom error message for this rule
CleanFilenameRule.prototype.getMessage = function (fieldName) {
    return fieldName + ' should only have the following characters a-z, A-Z, 0-9, ., ,,';
};

module.exports = CleanFilenameRule;