const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');

class StoreService {
    constructor(opts) {
        this.opts = opts;
        this.current_working_dir = process.cwd();
        this.userDataPath = this.getAppBasePath();
    }

    async init() {
        this.path = path.join(
            this.userDataPath,
            `${this.opts.folder ? this.opts.folder + '/' : ''}${this.opts.configName}.json`
        );
    
        const folderPath = path.join(this.userDataPath, this.opts.folder || '');
        const fallbackPath = path.join(
            this.current_working_dir, 'public',
            `${this.opts.folder ? this.opts.folder + '/' : ''}${this.opts.configName}.json`
        );
    
        const folderExists = await this.fileExists(folderPath);
    
        if (!folderExists) {
            await this.create_dir_if_not_exists(
                path.join(this.current_working_dir, 'public'),
                this.opts.folder
            );
            this.path = fallbackPath;
        }
    
        this.data = await this.parseDataFile(this.path, this.opts.defaults);
        return this;
    }
    
    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    getAppBasePath = () => {
        //development
        if (process.env.RUN_ENV === 'development') {
            return './'
        }

        if (!process.platform || !['win32', 'darwin'].includes(process.platform)) {
            console.error(`Unsupported OS: ${process.platform}`);
            return './'
        }

        //produnction
        if (process.platform === 'darwin') { 
            return `/Users/${process.env.USER}/Library/Application\Support/${process.env.APP_NAME}/`
        } 
        else if (process.platform === 'win32') { 
            return `${process.env.APPDATA}\\${process.env.APP_NAME}\\`
        }

        return app.getPath('userData');
    }

    get_data_path () {
        return this.path;
    }

    async create_dir_if_not_exists(root_path, path_getting_created) {
        await fs.mkdir(path.join(root_path, `${path_getting_created}`),
            { recursive: true }, (err) => {
            if (err) {
                console.error(err);
            } 
        });
    }
    
    // This will just return the property on the `data` object
    get(key = undefined) {
        let data = key ? this.data[key] : this.data; 

        return data;
    }
    
    async set(post_object) {
        const object = JSON.parse(post_object);
        const object_array = Object.entries(object);
    
        this.data = this.data ? this.data : {};
    
        object_array.forEach(element => {
            this.data[element[0]] = element[1];
        });
    
        try {
            await fs.writeFile(this.path, JSON.stringify(this.data, null, 2));
            return true;
        } catch (error) {
            return error;
        }
    }

    async parseDataFile(filePath, defaults) { 
        try {
            const data = await fs.readFile(filePath);

            return JSON.parse(data);
        } catch(error) {
            // if there was some kind of error, return the passed in defaults instead. 
            return defaults;
        }
    }
} 

module.exports = StoreService;