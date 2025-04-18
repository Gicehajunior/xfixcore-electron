const fs = require('fs'); 
const electron = require("electron"); 
const func = require('@helper/func');
const ExceptionHandler = require('@exception/handler'); 
const { app, contextBridge, BrowserWindow, ipcMain } = electron; 

class RouterService {
    constructor(BrowserWindow, ipcMain, DbConn) { 
        this.BrowserWindow = BrowserWindow;
        this.ipcMain = ipcMain;
        this.DBConnection = DbConn;
        this.route = undefined;
        this.controller = undefined;
        this.method_name = undefined;
        this.response_medium = undefined;

        this.get('/alertMessage', 'helper@showAlertDialog');
    }

    post(route, controller, response_medium = undefined) {   
        this.post_route(route, controller, response_medium);
    }

    get(route, controller, response_medium = undefined) { 
        this.get_route(route, controller, response_medium);
    }
    
    post_route(route, controller, response_medium = undefined) {
        if (!this.ipcMain.listenerCount(route)) {
            this.ipcMain.handle(route, async (event, data) => {  
                try {
                    response_medium = (response_medium !== undefined) 
                        ?   response_medium 
                        :   (route ? route : '');  
                    this.route_process(controller, response_medium, event, data);
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }
    
    get_route(route, controller, response_medium = undefined) {
        if (!this.ipcMain.listenerCount(route)) {
            this.ipcMain.once(route, async (event, data) => {  
                try {
                    response_medium = (response_medium !== undefined) 
                        ?   response_medium 
                        :   (route ? route : ''); 
                    this.route_process(controller, response_medium, event, data);
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }

    route_process(controller, response_medium, event, data = {}) {
        const controller_method_array = controller.split("@");
        this.controller = controller_method_array[0].replace("'", "");
        this.method_name = controller_method_array[1].replace("'", "");  
        this.response_medium = response_medium;
        var response = data; 

        if (!this.controller.includes('Controller')) {  
            if (this.controller == 'helper') {
                (new func(this.BrowserWindow)).showAlertDialog(data);
            }
            else {
                app.on('error', function(error) {
                    const ExceptionHandlerInstance = new ExceptionHandler(app);
                    ExceptionHandlerInstance.handle(error);
                });
            } 
        }
        else {
            let controller_class = this.RequireModule();  
            
            let controller_class_instance = new controller_class(this.BrowserWindow); 
            response = controller_class_instance[this.method_name](data);   
            this.run_response_channel(event, this.response_medium, response);
        }   
    }

    RequireModule() {
        var resolved_path = undefined;

        if (fs.existsSync(`${process.cwd()}/app/https/auth/${this.controller}.js`)) {
            resolved_path = `app/https/auth/`;
        }
        else if (fs.existsSync(`${process.cwd()}/app/https/controllers/${this.controller}.js`)) {
            resolved_path = `app/https/controllers/`;
        } 
        
        let controller_class = require(`../../${resolved_path}${this.controller}`);

        return controller_class;
    }

    run_response_channel(event, response_medium = undefined, response = undefined) { 
        if (response instanceof Promise) {
            Promise.resolve(response).then(value => {  
                if (value) {  
                    event.sender.send(response_medium, `${JSON.stringify(value)}`);
                } 
            }); 
        } 
    }
    
}

module.exports = RouterService;