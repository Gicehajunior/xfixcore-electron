require('dotenv').config();
const lang = require('@helper/lang');
const MP = require('@preload/SuperPreload/MP');
const { Utils, alert } = require('@config/app/utils');
const { ipcRenderer } = require('electron');

class Dashboard extends MP {
    constructor() {
        super();
    }

    index() {
        // Any applicable logic to handle.
    }

    save() {
        // Any logic to handle.
    }
}

module.exports = new Dashboard();


