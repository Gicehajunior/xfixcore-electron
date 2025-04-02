const fs = require("fs").promises;
const StoreService = require("@config/services/StoreService");

class UserSession {
    constructor() {
        this.current_directory = process.cwd(); 

        this.StoreService = new StoreService({folder: "Session Storage", type: "login_user", configName: 'eab-session', });

        this.session;
    }

    session(key) {
        try {
            this.session = this.StoreService.get(key ? key : '');
        } catch (error) {
            this.session = {};
        }

        return this.session;
    }

    save_session(object) {
        const store_response = this.StoreService.set(object);

        return store_response;
    } 

    async delete_session() {
        try {
            const session_file = this.StoreService.get_data_path(); 
            await fs.access(session_file); 
            await fs.unlink(session_file);
            return true;
        } catch (err) {
            if (err.code === 'ENOENT') { 
                return false;
            } else { 
                console.error(`Error occurred while trying to remove file: ${err.message}`);
                throw new Error(`Error occurred while trying to remove file: ${err.message}`);
            }
        }
    }
}

module.exports = UserSession;



