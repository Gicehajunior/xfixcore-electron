const AppModel = require("@models/AppModel"); 

class DashboardModel extends AppModel{
    static table = 'users';

    constructor() {
        super(); 
    }

}

module.exports = DashboardModel;