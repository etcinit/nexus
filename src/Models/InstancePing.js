"use strict";

/**
 * Factory function for InstancePing models
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function (sequelize, DataTypes) {
    var InstancePing;

    InstancePing = sequelize.define(
        'InstancePing',
        {
            instanceName: {
                type: DataTypes.STRING,
                unique: true
            },

            ApplicationId: {
                type: DataTypes.INTEGER
            },

            message: {
                type: DataTypes.TEXT
            }
        }
    );

    return InstancePing;
};