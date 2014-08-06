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
                unique: true,
                validate: {
                    isAlphanumeric: true,
                    notEmpty: true
                }
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true
                }
            }
        }
    );

    return User;
};