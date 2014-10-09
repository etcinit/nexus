"use strict";

/**
 * Factory function for Grant models
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function (sequelize, DataTypes) {
    var Grant;

    Grant = sequelize.define(
        'Grant',
        {
            ApplicationId: {
                type: DataTypes.INTEGER,
                unique: 'grantUnique'
            },
            FileId: {
                type: DataTypes.INTEGER,
                unique: 'grantUnique'
            },
            alias: {
                type: DataTypes.STRING
            }
        }
    );

    return Grant;
};