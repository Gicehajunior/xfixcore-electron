require('dotenv').config();
const AuthModel = require('@models/AuthModel');

class Util { 
    async getAllUsers() {
        return await AuthModel.findAll();
    } 
}

module.exports = Util;