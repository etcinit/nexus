"use strict";

/**
 * Factory function for User models
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define(
        'User',
        {
            username: {
                type: DataTypes.STRING,
                unique: true
            },
            password: DataTypes.STRING
        }
    );

    return User;
};