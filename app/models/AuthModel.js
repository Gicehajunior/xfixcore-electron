const jwt = require("jsonwebtoken");
const config = require("@config/app/config");
const AppModel = require("@models/AppModel");
const db = require('@config/database/Database'); 

class AuthModel extends AppModel {
    static table = 'users';

    static fields = {
        fullname: 'STRING',
        username: 'STRING',
        email: 'STRING',
        password: 'STRING',
        contact: 'STRING',
        reset_pass_security_code: 'INTEGER',
        rolename: 'STRING'
    };

    static nullableFields = [
        'contact', 'reset_pass_security_code', 'rolename'
    ]
    
    /**
     * Updates the session with a JWT token.
     * 
     * @param {Object} req - The request object
     * @returns {boolean} - Whether the session update was successful
     */
    async updateSession(req) {
        const token = jwt.sign(req.session.user, config.APP.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token || null;
        return !!req.session.token;
    } 

    /**
     * Defines all model associations and relationships.
     * This method is automatically called after all models are initialized.
     * 
     * @param {Object.<string, Model>} models - Dictionary of all initialized models,
     *   keyed by model name. Use this to reference other models when defining associations.
     */
    static associate(models) {
        // Define all associations here
    }
}

module.exports = AuthModel;
