"use strict";

/**
 * Factory function for building Application models
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function (sequelize, DataTypes) {
    var Application;

    Application = sequelize.define(
        'Application',
        {
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true
                }
            },
            description: {
                type: DataTypes.TEXT
            }
        },
        {
            classMethods: {
                associate: function (models) {
                    Application.hasMany(models.Grant, 'ApplicationId');
                }
            }
        }
    );

    return Application;
};