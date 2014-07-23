"use strict";

/**
 * Factory function for File models
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function(sequelize, DataTypes) {
    var File;

    File = sequelize.define(
        'File',
        {
            name: DataTypes.STRING
        }
    );

    return File;
};