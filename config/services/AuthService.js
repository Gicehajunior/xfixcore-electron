const fs = require("fs").promises; 

class AuthService {
    constructor(storeService) {
        this.sess;
        this.current_directory = process.cwd(); 
        this.storeService = storeService;
    } 
    
    session(key='') {
        try {
            this.sess = this.storeService.get(key ? key : '');
        } catch (error) {
            this.sess = {};
        }

        return this.sess;
    }

    async save_session(object) {
        const store_response = await this.storeService.set(object);

        return store_response;
    } 

    async delete_session() {
        try {
            const session_file = this.storeService.get_data_path(); 
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

module.exports = AuthService;



