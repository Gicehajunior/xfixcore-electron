const AppModel = require("@models/AppModel"); 

class DashboardModel extends AppModel{
    static table = 'contacts';

    static fields = {
        // applicable fields
    };

    static nullableFields = [
        // applicable nullable fields
    ]

    constructor() {
        super(); 
    }

}

module.exports = DashboardModel;