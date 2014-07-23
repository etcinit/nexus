"use strict";

/**
 * Factory function for ApplicationToken models
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function (sequelize, DataTypes)
{
    var ApplicationToken;

    ApplicationToken = sequelize.define(
        'ApplicationToken',
        {
            token: DataTypes.STRING,
            expiration_date: DataTypes.DATE
        },
        {
            classMethods: {
                associate: function (models) {
                    ApplicationToken.belongsTo(models.Application);
                }
            }
        }
    );

    return ApplicationToken;
};