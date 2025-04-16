const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const pug = require("pug");
const handlebars = require("handlebars");
const mail = require('./mail');   
const lang = require("@helper/lang");
const config = require("@config/app/config");
const { Utils, Util } = require("@config/app/utils");
const AuthService = require("@config/services/AuthService");
const StoreService = require("@config/services/StoreService");
const { ipcMain, contextBridge, ipcRenderer, BrowserWindow } = require("electron"); 

class XFIXCore {
    constructor() {  
        this.win = undefined;  
        this.date = new Date(); 
        this.post_object = undefined;
        this.country = config.APP.COUNTRY_CODE; 
        this.current_directory = process.cwd();  
        this.database_type = process.env.DB_CONNECTION;  
        this.datetime_now = this.created_at = this.updated_at =
             Util.dateToIsoStrFormat(this.date); 
    }

    async auth() {    
        try {
            const storeService = await new StoreService({
                folder: "Session Storage",
                type: "login_user",
                configName: "eab-session"
            }).init();
    
            const instance = new AuthService(storeService); 
            return instance;
        } catch (error) {
            console.error("Auth initialization failed:", error);
            throw error;
        }
    }

    async route(route, data = {}) {  
        this.win = BrowserWindow.getFocusedWindow();
        await this.loadTemplate(this.win, route, data);
        return;
    }

    /**
     * Accepts filename as param. 
     * Parses the filename to extract the extension
     * 
     * @param {string} filename 
     * 
     * @returns {string} ext
     */
    fileExtParser(filename) {
        let index = filename.lastIndexOf('.');
        let ext = index !== -1 ? filename.substring(index + 1) : '';

        return ext;
    }

    /**
     * Parses files and returns raw string
     * 
     * @param {string} file_name 
     * @param {Object} data 
     * @returns {promise} Promise
     */
    file_parser(file_name, data = {}) { 
        return new Promise((resolve, reject) => {
            let file;
            let VIEW_ENGINE = config.VIEW_ENGINE?.length ? config.VIEW_ENGINE : ""; 
    
            if (!this.fileExtParser(file_name)?.length) {
                file = file_name + `.${VIEW_ENGINE}`;
            }
    
            const renderFunction = this.templateRenderer(VIEW_ENGINE);
            if (!renderFunction) {
                return reject(new Error("Template renderer not found"));
            }
    
            renderFunction(file, data, (err, renderedHtml) => {
                if (err) {
                    console.error(`Error rendering ${VIEW_ENGINE} template:`, err);
                    return reject(err);
                } 
    
                resolve(renderedHtml);
            });
        });
    }

    /**
     * Parses mail templates.
     * 
     * @param {string} mail_template 
     * @param {Object} data 
     * @returns {string} mail_template
     */
    async mail_parse(mail_template, data = {}) { 
        try {
            var mail_template = await this.file_parser(
                `${this.current_directory}/${mail.markup_lang.default.path}${mail_template}`, 
                data
            );

            return mail_template;
        } catch (error) { 
            return error.message || `An error Occurred while trying to parse template ${mail_template}!`;
        } 
    }
    
    /**
     * Initializes application by exposing all methods of each module under `mexapi`.
     * 
     * @param {Object} modules - List of module instances.
     */
    initApplication(modules) {  
        const exposedModules = {}; 

        if (typeof modules === 'object' && modules !== null) {
            Object.entries(modules).forEach(([moduleName, moduleInstance]) => {
                if (moduleInstance && typeof moduleInstance === "object") {
                    exposedModules[moduleName] = {};
                    
                    Object.getOwnPropertyNames(Object.getPrototypeOf(moduleInstance))
                        .filter(method => typeof moduleInstance[method] === "function" && method !== "constructor")
                        .forEach(method => {
                            exposedModules[moduleName][method] = moduleInstance[method].bind(moduleInstance);
                        });
                }
            });
        }

        const requestSession = () => {
            ipcRenderer.send("request-session-data");
        }

        // Expose all modules and their methods directly under `mexapi`
        contextBridge.exposeInMainWorld("mexapi", {
            ...exposedModules,  
            requestSession: () => requestSession(),
            onSessionData: (callback) => {
                requestSession();
                ipcRenderer.on("session-data", (_, data) => callback(data));
            },
        });
    }

    getAllDirectories = (dirPath) => {
        let results = [dirPath];
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
      
        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);
            if (item.isDirectory()) {
                results = results.concat(this.getAllDirectories(fullPath));
            }
        }
      
        return results;
    };

    filePathMatcher(view_path, view_ext='ejs') { 
        let VIEWS = config.PATHS.VIEWS?.length ? config.PATHS.VIEWS : "";

        if (!VIEWS) {
            console.error("Missing VIEWS path configuration.");
            return null;
        }

        const expectedFileName =  view_path.replace(/\./g, '/').replace(/\/$/, '') + `.${view_ext}`;
        
        for (let basePath of this.getAllDirectories(VIEWS)) {
            let fullPath = path.join(basePath, expectedFileName);
            if (fs.existsSync(fullPath)) {
                return fullPath;
            }
        }

        console.error(`View file not found for: ${expectedFileName}`);
        return null;
    }

    /**
     * Defines the set engine render function, for template parsing.
     * 
     * @param {VIEW_ENGINE} VIEW_ENGINE 
     * @returns {function}
     */
    templateRenderer(VIEW_ENGINE) {
        let renderFunction;

        // Select rendering engine dynamically
        switch (VIEW_ENGINE) {
            case "ejs":
                renderFunction = (filePath, data, callback) => ejs.renderFile(filePath, data, {}, callback);
                break;

            case "pug":
                renderFunction = (filePath, data, callback) => {
                    try {
                        const compiledFunction = pug.compileFile(filePath);
                        callback(null, compiledFunction(data));
                    } catch (err) {
                        callback(err);
                    }
                };
                break;

            case "hbs":
            case "handlebars":
                renderFunction = (filePath, data, callback) => {
                    try {
                        const fileContent = fs.readFileSync(filePath, "utf8");
                        const template = handlebars.compile(fileContent);
                        callback(null, template(data));
                    } catch (err) {
                        callback(err);
                    }
                };
                break;

            default:
                console.error("Unsupported VIEW_ENGINE:", VIEW_ENGINE);
                return;
        }

        return renderFunction;
    }

    /**
     * Loads a template dynamically based on the configured VIEW_ENGINE
     * @param {BrowserWindow} win - The Electron BrowserWindow instance.
     * @param {string} view_path - Path to the template file.
     * @param {Object} data - Data to pass to the template.
     * 
     * @return {}
     */
    async loadTemplate(win, view_path, data = {}) { 
        data['lang'] = lang;
        data['asset_path'] = 'local://' + path.resolve('.'); 
        data['res_path'] = config.PATHS.VIEWS?.length ? config.PATHS.VIEWS : ""; 

        let VIEW_ENGINE = config.VIEW_ENGINE?.length ? config.VIEW_ENGINE : "";
        let _view_path = view_path.replace(/\./g, '/').replace(/\/$/, '');
        let templateFilePath = this.filePathMatcher(_view_path, VIEW_ENGINE);

        let renderFunction = this.templateRenderer(VIEW_ENGINE);
        if (renderFunction == undefined) return;

        // Render the file using the selected engine
        renderFunction(templateFilePath, data, (err, renderedHtml) => {
            if (err) {
                console.error(`Error rendering ${VIEW_ENGINE} template:`, err);
                return;
            } 

            // Convert rendered HTML to a Data URI
            const dataUri = `data:text/html;base64,${Buffer.from(renderedHtml).toString("base64")}`;

            if (win && dataUri) {
                win.loadURL(dataUri);

                // session flash
                this.mexSessionFlash({
                    route: _view_path
                });
            }
        });
    }

    /**
     * Handles session data requests and sends a response.
     * @param {Object} data - Optional session data to send.
     */
    mexSessionFlash(data = {}) {
        ipcMain.once("request-session-data", async (event) => { 
            event.reply("session-data", { ...data });
        });
    }
}

module.exports = XFIXCore;