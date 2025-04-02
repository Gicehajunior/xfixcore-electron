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
        const UsernameDomElements =  document.querySelectorAll(".username-in-session");

        UsernameDomElements.forEach(UsernameDomElement => {
            if (document.body.contains(UsernameDomElement)) {
                UsernameDomElement.innerHTML = `<i class="fa fa-user-circle" aria-hidden="true"></i> ${this.session['username']}`;
                alert({
                    status: 'info',
                    title: lang.notification_title.dashboard_welcome_notification_title,
                    message: lang.dashboard_welcome_notification
                });
            }
        });
    }

    save() {
        // Any logic to handle.
    }
}

module.exports = new Dashboard();


