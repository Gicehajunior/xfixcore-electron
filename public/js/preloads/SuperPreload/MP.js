require('dotenv').config();
const AppUserSession = require("@config/services/SessionService");
const { ipcRenderer } = require('electron');

class MP {
    constructor () {
        this.date = new Date();
        this.current_directory = process.cwd();
        this.sessionObject = new AppUserSession(); 
        this.session = this.sessionObject.session();
        this.windowLocation = window.location.href;
        this.datetime_now = this.date.toISOString().slice(0, 19).replace('T', ' ');
    }

    routerFunc() {
        console.log("It works!");
        document.querySelectorAll("a").forEach((link) => {
            if (link) {
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    const href = event.target instanceof HTMLElement ? event.target.getAttribute("href") : null;
                    this.navigateTo(href);
                }); 
            }
        });
    }

    // Extract query parameters from URL
    extractParams(url) {
        const urlObj = new URL(url, 'http://127.0.0.1');
        const params = {};
        urlObj.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return { path: urlObj.pathname, params };
    }
    
    navigateTo(endpoint) {
        const { path, params } = this.extractParams(endpoint);  
        ipcRenderer.send(path, JSON.stringify(params));
    }
    
    clearFormInputs() {
        const formInputs = document.querySelectorAll('.form-control');

        formInputs.forEach(input => {
            input.value = null;
        });
    }
}

module.exports = MP;
