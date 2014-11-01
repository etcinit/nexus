"use strict";

var table = 'InstancePings';

/**
 * Migration for creating the InstancePings table
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

                instanceName: {
                    type: DataTypes.STRING
                },

                ApplicationId: {
                    type: DataTypes.INTEGER
                },

                message: {
                    type: DataTypes.TEXT
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