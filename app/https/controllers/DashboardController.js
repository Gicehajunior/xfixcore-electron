const path = require('path');
const fs = require("fs");
const bcrypt = require('bcrypt'); 
const EmailValidator = require('validator');  
const {phone} = require('phone');
const DB = require('@config/DB');
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
        this.route("dashboard", {
            title: lang.title.login,
        }); 
    }
    
}

module.exports = DashboardController;