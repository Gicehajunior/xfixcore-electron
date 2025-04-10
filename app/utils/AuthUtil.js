require('dotenv').config();
const Util = require('@utils/Utils');
const AuthModel = require('@models/AuthModel');

class AuthUtil extends Util { 
    async userExistsById(id) {
        const user = await AuthModel.findOne({ where: { id: id } });
        return user ? true : false;
    }

    async userExistsByEmail(email) {
        const user = await AuthModel.findOne({ where: { email: email } });
        return user ? true : false;
    }

    async getUserById(id) {
        return await AuthModel.findOne({ where: { id: id } });
    } 

    async getUserByEmail(email) {
        return await AuthModel.findOne({ where: { email: email } });
    } 
    
}

module.exports = AuthUtil;