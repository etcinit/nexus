"use strict";

var table = 'ApplicationTokens';

/**
 * Migration for creating the ApplicationTokens table
 *
 * @type {{up: Function, down: Function}}
 */
module.exports = {
    /**
     * Run migration
     *
     * @param migration
     * @param DataTypes
     * @param done
     */
    up: function(migration, DataTypes, done) {
        migration.createTable(
            table,
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },

                token: {
                    type: DataTypes.STRING,
                    unique: true
                },
                comment: {
                    type: DataTypes.STRING
                },

                expiration_date: DataTypes.DATE,

                ApplicationId: {
                    type: DataTypes.INTEGER,
                    unique: 'grantUnique'
                },

                createdAt: {
                    type: DataTypes.DATE
                },

                updatedAt: {
                    type: DataTypes.DATE
                }
            }
        );

        done();
    },

    /**
     * Rollback migration
     *
     * @param migration
     * @param DataTypes
     * @param done
     */
    down: function(migration, DataTypes, done) {
        migration.dropTable(table);

        done();
    }
};