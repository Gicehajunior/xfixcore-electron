const { Model } = require('sequelize');
const { Util } = require('@config/app/utils');
const DB = require('@config/database/Database');

class AppModel extends Model { 

    /**
     * Initializes the model for Sequelize with the mutated fields
     * 
     * @param {Sequelize} sequelize - The Sequelize instance
     */
    static initModel(sequelize) { 
        return super.init(Util.mutateFields(
            this.fields, 
            this.nullableFields
        ), {
            sequelize,
            modelName: this.name,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: this.table,
            timestamps: true
        });
    }

    /**
     * Method to be overridden by child classes for associations
     * @param {Object} models - All initialized models
     */
    static associate(models) {
        // To be implemented by child classes
    }
}

module.exports = AppModel;
