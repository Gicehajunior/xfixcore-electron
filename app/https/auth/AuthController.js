const path = require('path');
const fs = require("fs");
const bcrypt = require('bcrypt'); 
const EmailValidator = require('validator');  
const {phone} = require('phone');
const DB = require('@config/DB');
const lang = require("@helper/lang");
const AuthModel = require("@models/AuthModel");
const Mailer = require("@config/services/MailerService"); 
const Util = require("@utils/Utils"); 
const XFIXCore = require("@config/app/XFIXCore"); 
const { BrowserWindow } = require("electron"); 
const { title } = require('process');

class AuthController extends XFIXCore {

    constructor() { 
        super();  
    }

    validatePhone(phonenumber) { 
        const response = phone(phonenumber, {country: this.country}); 
        return response;
    }

    loginUser() {
        this.route("auth.login", {
            title: lang.title.login,
        }); 
    }

    registerUser() {
        this.route("auth.signup", {
            title: lang.title.register
        }); 
    }
    
    async saveUsers(stringifiedUsersInfo) {  
        try {
            if (!stringifiedUsersInfo) {
                return { status: 'fail', message: lang.errors.empty_credentials };
            }
    
            const usersInfo = JSON.parse(stringifiedUsersInfo);
    
            if (Object.values(usersInfo).every(value => !value)) {
                return { status: 'fail', message: lang.errors.empty_credentials };
            }
    
            if (!usersInfo.email || !EmailValidator.isEmail(usersInfo.email)) {
                return { status: 'fail', message: lang.errors.invalid_email };
            }
    
            if (!usersInfo.contact || !this.validatePhone(usersInfo.contact).isValid) {
                return { status: 'fail', message: lang.errors.invalid_contact };
            }
    
            usersInfo.created_at = this.created_at;
            usersInfo.updated_at = this.updated_at;

            let existingUsers;
            const util = new Util();
            existingUsers = await util.select(AuthModel.table, ['*']);
            existingUsers = await util.where({ email: usersInfo.email });
            
            if (existingUsers.length > 0) {
                return { status: 'fail', message: lang.user_exists };
            }
    
            // Hash password
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(usersInfo.password, salt);
    
            if (!hashedPassword) {
                return { status: 'fail', message: lang.errors.invalid_password };
            }
    
            usersInfo.password = hashedPassword;
            const isSaved = await util.save_resource(AuthModel.table, JSON.stringify(usersInfo));
    
            return isSaved
                ? { status: 'OK', message: lang.success.create_account }
                : { status: 'fail', message: lang.errors.create_account };
    
        } catch (error) {
            console.error(error);
            return { status: 'fail', message: error.message || lang.errors.internal_server_error };
        }
    }
    
    async loginUsers(stringifiedUsersInfo) {
        const usersInfo = JSON.parse(stringifiedUsersInfo);
    
        if (Object.values(usersInfo).every(value => value === null || value === undefined || value === '')) {
            return { status: 'fail', message: lang.errors.empty_credentials };
        }
    
        if (!EmailValidator.isEmail(usersInfo.email)) { 
            return { status: 'fail', message: lang.errors.invalid_email };
        }
    
        const util = new Util();
        util.select(AuthModel.table, ['*']);
    
        try {
            const rows = await util.where({ email: usersInfo.email });
            const userRow = rows[0];
    
            if (!userRow) {
                return { status: 'fail', message: lang.errors.user_not_exists };
            }
    
            const passwordMatch = await bcrypt.compare(usersInfo.password, userRow.password);
    
            if (!passwordMatch) {
                return { status: 'fail', message: lang.errors.wrong_user_credentials };
            }
    
            const object = {
                "id": userRow.id ? userRow.id : (userRow.rowid ? userRow.rowid : 0),
                "whoiam": userRow.whoiam,
                "username": userRow.username,
                "email": userRow.email,
                "contact": userRow.contact,
                "created_at": userRow.created_at,
                "updated_at": userRow.updated_at
            };
    
            this.auth.save_session(JSON.stringify(object));
            this.route("dashboard", {
                title: lang.title.dashboard
            });
    
            return { status: 'OK', message: lang.success.login_success };
    
        } catch (err) {
            console.log(err);
            return { status: 'fail', message: err.message || lang.errors.general_error };
        }
    }   

    forgotPasswordView() {
        this.route("auth.forgotpassword", {
            title: lang.title.forgotpassword
        }); 
    }

    resetPasswordView() {
        this.route("auth.resetpassword", {
            title: lang.title.resetpassword
        }); 
    }

    async forgotPassword(email = []) {
        if (email.length === 0) {
            return {status: 'fail', message: lang.errors.empty_email};
        }
    
        if (!EmailValidator.isEmail(email)) {
            return {status: 'fail', message: lang.errors.invalid_email};
        }
    
        try {
            const util = new Util();
            util.select(AuthModel.table, ['*']);
            const rows = await util.where({ email: email });
    
            if (rows[0] == undefined) {
                return {status: 'fail', message: lang.errors.user_not_found};
            }
            
            // Save session
            this.auth.save_session(JSON.stringify({
                "id": rows[0].id || rows[0].rowid, 
                "email": email
            }));

            const security_code = Math.floor(100000 + Math.random() * 900000);
            const recipients = email;
            const subject = "Reset Password Security Code";
            const html_message_formart = await this.mail_parse(`scode-mail`, { 
                notification_title: "Password Reset Code",
                recipient_name: rows[0].username,
                verification_code: security_code,
                validity_period: 60,
                support_link: 'xfixcore.com',
                company_name: 'XFIX Inc.'
            }); 
            console.log(`RECIPIENTS: ${recipients}`);
            const text_message_formart = security_code;

            // Send email
            const MailerService = new Mailer();
            const send_email_response = await MailerService.send(recipients, subject, html_message_formart, text_message_formart);
            
            if (!send_email_response || !send_email_response.response.includes('OK')) { 
                return { status: 'fail', message: lang.errors.auth_error };
            }

            this.post_object = JSON.stringify({"reset_pass_security_code": security_code});

            if (this.session && 'id' in this.session) {
                const update_response = await util.update_resource_by_id(AuthModel.table, this.post_object, this.session["id"]);

                if (update_response) {
                    this.route("auth.resetpassword", {
                        title: lang.title.resetpassword
                    });
                }
            }

            this.route("auth.resetpassword", {
                title: lang.title.resetpassword
            }); 
    
        } catch (error) {
            console.error('Error occurred during forgot Password process:', error.message);
            this.route("auth.resetpassword", {
                title: lang.title.resetpassword
            });
        }
    }

    async resetPassword(post_object) {
        let object = JSON.parse(post_object);
    
        try { 
            const util = new Util();
            await util.select(AuthModel.table, ['*']);
            const rows = await util.where({ email: this.session["email"] });
            const userRow = rows[0];
            
            if (!userRow) {
                return { status: 'fail', message: lang.errors.user_not_exists };
            }
            
            if (object.security_code !== userRow.reset_pass_security_code) {
                return { status: 'fail', message: lang.errors.wrong_security_code };
            }
            
            if (object.password !== object.confirm_password) {
                return { status: 'fail', message: lang.errors.password_mismatch };
            }
    
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(object.password, salt);
            
            if (hash.length === 0) {
                return { status: 'fail', message: lang.errors.invalid_password };
            }
            
            this.post_object = JSON.stringify({
                "password": hash,
                "reset_pass_security_code": 0,
                "updated_at": this.updated_at
            });
            
            const updateResponse = await util.update_resource_by_id(AuthModel.table, this.post_object, this.session["id"]);
            
            if (!updateResponse) {
                return { status: 'fail', message: lang.errors.reset_password };
            }
            
            this.route("auth.login", {
                title: lang.title.login
            });
    
        } catch (error) {
            console.error('Error during password reset process:', error);
            return { status: 'fail', message: lang.errors.unexpected_error };
        }
    }  

    createTable(table_object) { 
        const table_object_parsed = JSON.parse(table_object);

        const sql_query = table_object_parsed.sql_query;
        const table = table_object_parsed.table;

        const response_promise = new Promise(resolve => {
            if (this.database_type == "sqlite") {
                try { 
                    DB.serialize(() => {
                        DB.run(sql_query);
                        
                        resolve({status: 'OK', message: `${table} table creation success`});
                    });  
                } catch (error) { 
                    resolve({status: 'fail', message: `${table} table creation fail`});
                } 
            }
            else if (this.database_type == "mysql") { 
                DB.query(sql_query, (err, result) => {
                    if (err) {  
                        resolve({status: 'fail', message: `${table} table creation fail`});
                    }
                    else {
                        resolve({status: 'OK', message: `${table} table creation success`});
                    }
                }); 
            }
        });

        return response_promise;
    }
    
    logoutUser() {   
        this.auth.delete_session().then((response) => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        });

        this.loginUser();
    }

}

module.exports = AuthController;
