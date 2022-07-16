const { contextBridge, ipcRenderer } = require('electron');
const path = require('path'); 

window.addEventListener('DOMContentLoaded', () => { 
    ipcRenderer.invoke('createTable', 'users');

    ipcRenderer.on("create-table", (event, response) => {
        console.log(response);
    });

    const signup_user_form = document.querySelector(".signup_user_form")
    const register_btn = document.getElementById("btn-register");

    const login_user_form = document.querySelector(".login_user_form");
    const login_user_btn = document.getElementById("btn-login");

    const users_message = document.getElementById("users_message");

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if (document.body.contains(signup_user_form)) {
        register_btn.addEventListener("click", (event) => {
            event.preventDefault();   
            const username = document.getElementById("username");
            const tel = document.getElementById("tel"); 

            if (username.value == '' ||
                email.value == '' ||
                tel.value == '' ||
                password.value == ''
            ) {
                users_message.innerHTML = `<small>Please fill in all fields to proceed!</small>`;
                users_message.style.color = "red";
            } 
            else {
                const usersInfo = {
                    "whoiam": 2, 
                    "username": username.value, 
                    "email": email.value, 
                    "contact": tel.value, 
                    "password": password.value, 
                    "created_at": "", 
                    "updated_at": ""
                };

                ipcRenderer.invoke("registerUser", JSON.stringify(usersInfo)); 
                
                ipcRenderer.on("save-users", (event, response) => { 
                    if (response.includes("user exists")) { 
                        users_message.innerHTML = `<small>Seems you're already registered. Please proceed to login!</small>`;
                        users_message.style.color = "green";
                    }
                    else if (response.includes("Please input a strong password!")) {
                        users_message.innerHTML = `<small>Password to short or too long. Please fill in a strong password!</small>`;
                        users_message.style.color = "green";
                    }
                    else if (response.includes("Registration successfull!")) {
                        users_message.innerHTML = `<small>Registration successfull. Go to login page to proceed!</small>`;
                        users_message.style.color = "green";
                    }
                });
            } 
        });
    }
    else if (document.body.contains(login_user_form)) {
        login_user_btn.addEventListener("click", (event) => {
            event.preventDefault();

            if (email.value == '' ||
                password.value == ''
            ) { 
                users_message.innerHTML = `<small>Please fill in all fields to login!</small>`;
                users_message.style.color = "red";
            } 
            else {
                const usersInfo = {  
                    "email": email.value,  
                    "password": password.value, 
                };

                const loginUser = ipcRenderer.invoke("loginUser", JSON.stringify(usersInfo)); 

                ipcRenderer.on("login-response", (event, response) => { 
                    if (response.includes("password matches")) { 
                        users_message.innerHTML = `<small>Login Successfull, Navigating to Dashboard. Please wait...</small>`;
                        users_message.style.color = "green";

                        setTimeout(() => {
                            window.location.pathname = path.join(__dirname, '../../resources/views/dashboard.html');
                        }, 2000);
                    }
                    else if (response.includes("Incorrect login credentials")) {
                        users_message.innerHTML = `<small>Wrong Password. Fill in correct password to proceed!</small>`;
                        users_message.style.color = "green";
                    }
                    else if (response.includes("no user found")) {
                        users_message.innerHTML = `<small>No user found with that Username. Please register to procedd!</small>`;
                        users_message.style.color = "green";
                    }
                }); 
            } 
        });
    }
}); 

