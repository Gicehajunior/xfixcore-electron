const path = require('path');
const fs = require("fs");
const bcrypt = require('bcrypt'); 
const EmailValidator = require('validator');  
const {phone} = require('phone'); 
const lang = require("@helper/lang");
const Util = require("@utils/Utils"); 
const AuthUtil = require('@utils/AuthUtil');
const AuthModel = require("@models/AuthModel");
const Mailer = require("@config/services/MailerService"); 
const XFIXCore = require("@config/app/XFIXCore");  

class AuthController extends XFIXCore {

    constructor() { 
        super();  
    }

    validatePhone(phonenumber) { 
        const response = phone(phonenumber, {country: this.country}); 
        return response;
    }

    loginUser() {
        return this.route("auth.login", {
            title: lang.title.login,
        }); 
    }

    registerUser() {
        return this.route("auth.signup", {
            title: lang.title.register
        }); 
    }
    
    forgotPasswordView() {
        return this.route("auth.forgotpassword", {
            title: lang.title.forgotpassword
        }); 
    }

    resetPasswordView() {
        return this.route("auth.resetpassword", {
            title: lang.title.resetpassword
        }); 
    }

    async saveUsers(stringifiedUsersInfo) {  
        try {
            if (!stringifiedUsersInfo) {
                return { status: 'fail', message: lang.errors.empty_credentials };
            }

            const usersInfo = JSON.parse(stringifiedUsersInfo);
    
            let {fullname, username, email, contact, password, rolename} = usersInfo;

            if (Object.values(usersInfo).every(value => !value)) {
                return { status: 'fail', message: lang.errors.empty_credentials };
            }
    
            if (!email || !EmailValidator.isEmail(email)) {
                return { status: 'fail', message: lang.errors.invalid_email };
            }
    
            if (!contact || !this.validatePhone(contact).isValid) {
                return { status: 'fail', message: lang.errors.invalid_contact };
            }
            
            const util = new AuthUtil();
            const user = await util.userExistsByEmail(email); 
            
            if (user) {
                return { status: 'fail', message: lang.user_exists };
            }
    
            // Hash password
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            if (!hashedPassword) {
                return { status: 'fail', message: lang.errors.invalid_password };
            }
            
            const isSaved = await AuthModel.create({fullname: fullname, username: username, email: email, password: hashedPassword, contact: contact, rolename: rolename});
    
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
    
        if (Object.values(usersInfo).every(value => !value)) {
            return { status: 'fail', message: lang.errors.empty_credentials };
        }
    
        if (!EmailValidator.isEmail(usersInfo.email)) {
            return { status: 'fail', message: lang.errors.invalid_email };
        }
    
        const util = new AuthUtil();
    
        try {
            const user = await util.getUserByEmail(usersInfo.email);
            if (!user) {
                return { status: 'fail', message: lang.errors.user_not_exists };
            }
    
            const passwordMatch = await bcrypt.compare(usersInfo.password, user.password);
            if (!passwordMatch) {
                return { status: 'fail', message: lang.errors.wrong_user_credentials };
            }
    
            const sessionObject = {
                id: user.id,
                rolename: user.rolename,
                username: user.username,
                email: user.email,
                contact: user.contact,
                created_at: user.created_at,
                updated_at: user.updated_at
            };
            
            (await this.auth()).save_session(JSON.stringify(sessionObject, null, 2)); 
            this.session = (await this.auth()).session(); 

            return this.route("/dashboard", {
                title: lang.title.dashboard, session: this.session
            }); 
    
        } catch (err) {
            console.error(err);
            return { status: 'fail', message: err.message || lang.errors.general_error };
        }
    }
    
    async forgotPassword(email = '') {
        if (!email) {
            return { status: 'fail', message: lang.errors.empty_email };
        }
    
        if (!EmailValidator.isEmail(email)) {
            return { status: 'fail', message: lang.errors.invalid_email };
        }
    
        try {
            const util = new AuthUtil();
            const user = await util.getUserByEmail(email);
    
            if (!user) {
                return { status: 'fail', message: lang.errors.user_not_found };
            }
    
            const security_code = Math.floor(100000 + Math.random() * 900000);
    
            await this.auth.save_session(JSON.stringify({ id: user.id, email: user.email }));
    
            const html_message = await this.mail_parse('scode-mail', {
                notification_title: "Password Reset Code",
                recipient_name: user.username,
                verification_code: security_code,
                validity_period: 60,
                support_link: 'xfixcore.com',
                company_name: 'XFIX Inc.'
            });
    
            const MailerService = new Mailer();
            const send_response = await MailerService.send(email, "Reset Password Security Code", html_message, security_code);
    
            if (!send_response || !send_response.response.includes('OK')) {
                return { status: 'fail', message: lang.errors.auth_error };
            }
    
            await AuthModel.update(
                { reset_pass_security_code: security_code },
                { where: { id: user.id } }
            );
    
            return this.route("auth.resetpassword", {
                title: lang.title.resetpassword
            });
    
        } catch (err) {
            console.error('Forgot Password Error:', err);
            return this.route("auth.resetpassword", {
                title: lang.title.resetpassword
            });
        }
    }
    
    async resetPassword(post_object) {
        const object = JSON.parse(post_object);
    
        try {
            const util = new AuthUtil();
            this.session = (await this.auth()).session();
            const user = await util.getUserByEmail(this.session.email);
    
            if (!user) {
                return { status: 'fail', message: lang.errors.user_not_exists };
            }
    
            if (object.security_code !== user.reset_pass_security_code) {
                return { status: 'fail', message: lang.errors.wrong_security_code };
            }
    
            if (object.password !== object.confirm_password) {
                return { status: 'fail', message: lang.errors.password_mismatch };
            }
    
            const hash = await bcrypt.hash(object.password, 10);
    
            await AuthModel.update(
                {
                    password: hash,
                    reset_pass_security_code: 0,
                    updated_at: new Date()
                },
                { where: { id: user.id } }
            );
    
            return this.route("auth.login", {
                title: lang.title.login
            });
    
        } catch (err) {
            console.error('Reset Password Error:', err);
            return { status: 'fail', message: lang.errors.unexpected_error };
        }
    }
    
    async logoutUser() {   
        (await this.auth()).delete_session().then((response) => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        });

        this.loginUser();
    }

}

module.exports = AuthController;
