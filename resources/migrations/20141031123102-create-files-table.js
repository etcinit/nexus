"use strict";

var table = 'Files';

/**
 * Migration for creating the Files table
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

                name: {
                    type: DataTypes.STRING,
                    unique: true
                },

                contents: {
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