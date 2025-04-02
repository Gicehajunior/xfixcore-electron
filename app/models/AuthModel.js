const AppModel = require("@models/AppModel");

class AuthModel extends AppModel{
    static table = 'users';
    
    constructor() {
        super(); 
    }
 
}

module.exports = AuthModel;