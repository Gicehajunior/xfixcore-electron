require('dotenv').config();
const lang = require('@helper/lang');
const MP = require('@preload/SuperPreload/MP'); 
const { ipcRenderer } = require('electron');

class GeneralPreload extends MP {
    constructor() {
        super();
    }

    index() {
        this.routerFunc();
        // Add any logic to setup window on-open event  
    }
}

module.exports = new GeneralPreload();