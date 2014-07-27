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
            name: {
                type: DataTypes.STRING,
                unique: true
            },
            contents: {
                type: DataTypes.TEXT
            }
        }
    );

    return File;
};