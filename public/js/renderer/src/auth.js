class Auth {
    constructor(api) {
        this.api = api; 
    }

    auth() {  
        this.api.onSessionData(data => { 
            if (data.route && data.route.includes('auth')) { 
                this.api.auth.authUsers();
            }
        });
    }

    initCrmDashboard() {
        this.api.onSessionData(data => { 
            if (data.route && data.route.includes('dashboard')) { 
                this.api.auth.logoutUser(); 
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    waitForApi("mexapi", (api) => { 
        const authInstance = new Auth(api); 
        authInstance.auth();
        authInstance.initCrmDashboard();
    });
});