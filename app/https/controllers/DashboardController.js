const path = require('path');
const fs = require("fs");
const bcrypt = require('bcrypt'); 
const EmailValidator = require('validator');  
const {phone} = require('phone'); 
const lang = require("@helper/lang");
const Util = require("@utils/Utils");
const DashboardModel = require("@models/AuthModel");
const Mailer = require("@config/services/MailerService"); 
const XFIXCore = require("@config/app/XFIXCore"); 

class DashboardController extends XFIXCore {

    constructor() {
        super();
        // ANY CONSTRUCTOR LOGIC
    }

    index() {
        return this.route("/dashboard", {
            title: lang.title.dashboard, session: this.session
        }); 
    }
    
}

module.exports = DashboardController;