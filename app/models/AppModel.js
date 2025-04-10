const { Model } = require('sequelize');
const db = require('@config/database/Database');

class AppModel extends Model { 

    /**
     * Initializes the model for Sequelize with the mutated fields
     * 
     * @param {Sequelize} sequelize - The Sequelize instance
     */
    static initModel(sequelize) { 
        return super.init(db.mutateFields(
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
