require('dotenv').config(); 
const lang = require('@helper/lang');  
const MP = require('@preload/SuperPreload/MP');
const { Utils, alert } = require('@config/app/utils');
const { ipcRenderer } = require('electron');

class Auth extends MP {
    constructor() {
        super();
    }

    index() {  
        // Add any logic to setup home window on-open event
    }

    async authUsers() {
        const signup_user_form = document.querySelector(".signup_user_form")
        const register_btn = document.getElementById("btn-register");

        const login_user_form = document.querySelector(".login_user_form");
        const login_user_btn = document.getElementById("btn-login");

        const users_message = document.getElementById("users_message");

        const email = document.getElementById("email");
        const password = document.getElementById("password");

        const forgot_password = document.querySelector(".forgot-password");
        const reset_password = document.querySelector(".reset-password");

        const request_security_code_btns = document.querySelectorAll(".request-security-code-btn");
        const reset_password_btns = document.querySelectorAll(".reset-password-btn");

        if (document.body.contains(signup_user_form)) {
            register_btn.addEventListener("click", async (event) => {
                event.preventDefault();
                register_btn.disabled = true;
                const fullname = document.getElementById("fullname");
                const username = document.getElementById("username");
                const tel = document.getElementById("tel");

                const usersInfo = {
                    "fullname": fullname.value,
                    "username": username.value,
                    "email": email.value,
                    "contact": tel.value,
                    "password": password.value, 
                    "rolename": 'user'
                };
                
                try {
                    let response = await this.ipcRequest("/registerUser", JSON.stringify(usersInfo));
                    if (response) {
                        response = JSON.parse(response);

                        if (response.status == 'OK') {
                            this.clearFormInputs();
                            users_message.innerHTML = response.message;
                            users_message.style.color = "green"; 
                        }
                        else {
                            users_message.innerHTML = response.message;
                            users_message.style.color = "red";
                        }
    
                        register_btn.innerHTML = lang.register_button_innerhtml_context;
                        register_btn.disabled = false;
                    }
                } catch (error) {
                    console.log(error.message || "An error Occurred");
                } 
            });
        }
        else if (document.body.contains(login_user_form)) {
            login_user_btn.addEventListener("click", async (event) => {
                event.preventDefault();
                login_user_btn.disabled = true; 
                const usersInfo = {
                    "email": email.value,
                    "password": password.value,
                }; 

                try {
                    let response = await this.ipcRequest("/loginUser", JSON.stringify(usersInfo));
                    if (response) {
                        response = JSON.parse(response);  
                        if (response.status == 'OK') {
                            users_message.innerHTML = response.message;
                            users_message.style.color = "green";
                            this.clearFormInputs(); 
                        }
                        else {
                            users_message.innerHTML = response.message;
                            users_message.style.color = "red";
                            login_user_btn.disabled = false;
                        } 

                        login_user_btn.innerHTML = lang.login_button_innerhtml_context; 
                    }
                } catch (error) {
                    console.log(error.message || "An error Occurred");
                }
            });
        }
        else if (document.body.contains(forgot_password)) {
            request_security_code_btns.forEach(request_security_code_btn => {
                request_security_code_btn.addEventListener('click', async () => {
                    request_security_code_btn.disabled = true;
                    if (email.value.length == 0) {
                        alert({
                            status: 'info',
                            title: lang.notification_title.forgot_password_notification_title,
                            message: lang.input_security_code_notification
                        });
                        request_security_code_btn.innerHTML = lang.forgot_password_button_innerhtml_context;
                        request_security_code_btn.disabled = false;
                    }
                    else { 
                        try {
                            let response = await (new Auth()).ipcRequest("/forgot-password", email.value);
                            if (response) {
                                response = JSON.parse(response);  
                                if (response.status == 'OK') {
                                    alert({
                                        status: 'info',
                                        title: lang.notification_title.forgot_password_notification_title,
                                        message: response.message
                                    });
                                }
                                else {
                                    alert({
                                        status: 'error',
                                        title: lang.notification_title.forgot_password_notification_title,
                                        message: response.message
                                    });
                                }

                                request_security_code_btn.innerHTML = lang.forgot_password_button_innerhtml_context;
                                request_security_code_btn.disabled = false; 
                            }
                        } catch (error) {
                            console.log(error.message || "An error Occurred");
                        }
                    }
                });
            });
        }
        else if (document.body.contains(reset_password)) {
            reset_password_btns.forEach(reset_password_btn => {
                reset_password_btn.addEventListener('click', async () => {
                    reset_password_btn.disabled = true;
                    const security_code = document.getElementById("security-code");
                    const confirm_password = document.getElementById("confirm-password");

                    if (security_code.value.length == 0 || password.value.length == 0 || confirm_password.value.length == 0) {
                        alert({
                            status: 'info',
                            title: lang.notification_title.reset_password_notification_title,
                            message: lang.fill_in_all_fields
                        });
                        reset_password_btn.innerHTML = lang.reset_password_button_innerhtml_context;
                        reset_password_btn.disabled = false;
                    }
                    else {
                        const reset_password_post_object = JSON.stringify({
                            "security_code": security_code.value,
                            "password": password.value,
                            "confirm_password": confirm_password.value
                        }); 

                        try {
                            let response = await (new Auth()).ipcRequest("/reset-password", reset_password_post_object);
                            if (response) {
                                response = JSON.parse(response);  
                                if (response.status == 'fail')  {
                                    alert({
                                        status: 'error',
                                        title: lang.notification_title.reset_password_notification_title,
                                        message: response.message
                                    });
                                } 

                                reset_password_btn.innerHTML = lang.reset_password_button_innerhtml_context;
                                reset_password_btn.disabled = false;
                            }
                        } catch (error) {
                            console.log(error.message || "An error Occurred");
                        }
                    }
                });
            });
        }
    }

    logoutUser() {
        const logoutBtn = document.getElementById("logout-btn");

        if (document.body.contains(logoutBtn)) {
            logoutBtn.addEventListener('click', async () => { 
                try {
                    let response = await (new Auth()).ipcRequest("/logoutUser");
                    if (response) { 
                        console.log("Logged out successfully!");
                    }
                } catch (error) {
                    console.log(error.message || "An error Occurred");
                }
            });
        }
    }
}

module.exports = new Auth();

