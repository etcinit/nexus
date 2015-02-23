"use strict";

var table = 'Grants';

/**
 * Migration for creating the Grants table
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