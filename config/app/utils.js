
const fs = require("fs"); 
const { DataTypes } = require('sequelize');
const config = require("@config/app/config");
const { ipcRenderer, BrowserWindow } = require("electron");; 

class Utils{
    constructor(file_name = undefined) {  
        this.file = file_name; 
        this.current_directory = process.cwd(); 
    }

    alert(message) {
        ipcRenderer.send('/alertMessage', message);
    }

    removeSpaces(str) {
        var regexPattern = /\s+/g;
    
        var trimmed_str = str.replace(regexPattern, " ");
    
        return trimmed_str.trim();
    }

    dateToIsoStrFormat(date) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    /**
     * Mutates the fields into defined Sequelize columns
     * 
     * @param {Object} fields - Object where keys are field names, values are string types, DataTypes, or config objects
     * @returns {Object} Sequelize-compatible column fields
     */
    mutateFields(fields, nullableFields=[]) {
        const fieldDefinitions = {}; 

        if (fields) {
            Object.entries(fields).forEach(([field, config]) => { 
                if (typeof config == 'string') {
                    fieldDefinitions[field] = {
                        type: DataTypes[config.toUpperCase()],
                        allowNull: nullableFields.includes(field)
                    };
                }
                else if (typeof config === 'function' && config.key) {
                    fieldDefinitions[field] = {
                        type: config,
                        allowNull: nullableFields.includes(field)
                    };
                }
                else if (typeof config === 'object' && config.type) {
                    fieldDefinitions[field] = {
                        ...config,
                        allowNull: config.allowNull ?? nullableFields.includes(field)
                    };
                }
            });
        }

        return fieldDefinitions;
    }
}

module.exports = {Util: new Utils(), Utils: Utils, alert: (new Utils()).alert};