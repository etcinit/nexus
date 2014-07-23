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
            ApplicationId: DataTypes.INTEGER,
            FileId: DataTypes.INTEGER
        }
    );

    return Grant;
};