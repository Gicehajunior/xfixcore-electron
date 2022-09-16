const fs = require('fs'); 

class RouterService {
    constructor(BrowserWindow, ipcMain, DbConn) { 
        this.BrowserWindow = BrowserWindow;
        this.ipcMain = ipcMain;
        this.DBConnection = DbConn;
        this.controller = undefined;
        this.method_name = undefined;
        this.response_medium = undefined;
    }

    post(route, controller, response_medium = undefined) {  
        this.post_route(route, controller, response_medium);
    }

    get(route, controller, response_medium = undefined) {
        this.get_route(route, controller, response_medium);
    }

    post_route(route, controller, response_medium = undefined) {
        const controller_method_array = controller.split("@");  

        this.ipcMain.handle(route, (event, data) => {  
            try {
                this.controller = controller_method_array[0].replace("'", "");

                this.method_name = controller_method_array[1].replace("'", ""); 

                let config = this.RequireModule();
                let controller_class = config.controller_class;
                let resolved_path = config.resolved_path;

                let controller_class_instance = new controller_class(this.DBConnection, this.BrowserWindow); 

                const responsepromise = controller_class_instance[this.method_name](data); 

                this.response_medium = response_medium;

                this.run_response_channel(event, `${process.cwd()}/${resolved_path}/${this.controller}.js`, responsepromise, this.response_medium); 
            } catch (error) {
                console.log(error);
            }
        });
    } 

    get_route(route, controller, response_medium = undefined) {
        const controller_method_array = controller.split("@");

        this.ipcMain.on(route, (event, data) => {  
            try {
                this.controller = controller_method_array[0].replace("'", "");

                this.method_name = controller_method_array[1].replace("'", ""); 

                let config = this.RequireModule();
                let controller_class = config.controller_class;
                let resolved_path = config.resolved_path;
                
                let controller_class_instance = new controller_class(this.DBConnection, this.BrowserWindow); 
                
                const responsepromise = controller_class_instance[this.method_name](data);  

                this.response_medium = response_medium;
                this.run_response_channel(event, `${process.cwd()}/${resolved_path}/${this.controller}.js`, responsepromise, this.response_medium); 
            } catch (error) {
                console.log(error);
            }
        });
    }

    RequireModule() {
        var resolved_path = undefined;

        if (fs.existsSync(`${process.cwd()}/app/https/auth/${this.controller}.js`)) {
            resolved_path = `app/https/auth/`;
        }
        else {
            resolved_path = `app/https/controllers/`;
        }
        
        let controller_class = require(`../../${resolved_path}${this.controller}`);

        return {controller_class: controller_class, resolved_path: resolved_path};
    }

    run_response_channel(event, controller_module, responsepromise, response_medium = undefined) {  
        if (fs.existsSync(controller_module)) {
            Promise.resolve(responsepromise).then(value => {  
                if (value) {
                    event.sender.send(response_medium, `${value}`);
                } 
            });
        } 
    }
    
}

module.exports = RouterService;
