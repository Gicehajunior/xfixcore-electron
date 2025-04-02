
const fs = require("fs"); 
const config = require("@config/app/config");
const { ipcRenderer, BrowserWindow } = require("electron");; 

class Utils{
    constructor(file_name = undefined) {  
        this.file = file_name; 
        this.current_directory = process.cwd(); 
    }

    alert(message) {
        ipcRenderer.send('/alertMessage', message);
    }

    removeSpaces(str) {
        var regexPattern = /\s+/g;
    
        var trimmed_str = str.replace(regexPattern, " ");
    
        return trimmed_str.trim();
    }

    dateToIsoStrFormat(date) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
}

module.exports = {Util: new Utils(), Utils: Utils, alert: (new Utils()).alert};