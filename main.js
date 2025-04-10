// Modules to control application life and create native browser window
require('module-alias/register');
require('dotenv').config(); 
const fs = require('fs');
const path = require('path'); 
const lang = require("@helper/lang");
const Routes = require('@routes/native');
const config = require('@config/app/config');
const XFIXCore = require('@config/app/XFIXCore');
const { Utils } = require('@config/app/utils');
const database = require('@config/database/Database');
const ExceptionHandler = require('@app/Exceptions/handler'); 
const { app, contextBridge, BrowserWindow, ipcMain, session, protocol } = require("electron"); 

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: config.BROWSER.WindowConstructorOptions.WIDTH, 
    height: config.BROWSER.WindowConstructorOptions.HEIGHT, 
    minWidth: config.BROWSER.WindowConstructorOptions.MINWIDTH, 
    minHeight: config.BROWSER.WindowConstructorOptions.MINHEIGHT, 
    webPreferences: { 
      preload: path.join(__dirname, 'public/js/preloads/global-preload.js'), 
      webSecurity: true,
      nodeIntegration: true,
      contextIsolation: true, // set to false to allow common js in the preloads
      sandbox: false,
    }, 
    icon: path.join(__dirname, 'public/storage/icons/sp-logo.png')
  }); 
  
  (new XFIXCore()).loadTemplate(
    mainWindow, 
    'auth.login',
    {title: lang.title.login, dir_name: `file://${__dirname}`}
  );

  mainWindow.setMenu(null);

  // Open the DevTools.
  if (process.env.DEBUG.toLocaleLowerCase() == 'true') {
    mainWindow.webContents.openDevTools();
  } 

  mainWindow.once("ready-to-show", () => { 
    setTimeout(() => {
      mainWindow.focus(); 
    }, 2000);
  });
}

app.on('error', function(error) {
  const ExceptionHandlerInstance = new ExceptionHandler(app);
  ExceptionHandlerInstance.handle(error);
});

const fileProtocolInterceptor = () => {
  protocol.handle("local", async (request) => {  
    let url = new URL(request.url);
    let filePath = path.normalize(decodeURIComponent(url.pathname)); 

    if (fs.existsSync(filePath)) {
      return new Response(fs.readFileSync(filePath), {
        headers: { "Content-Type": getMimeType(filePath) },
      });
    }
  });
};

const getMimeType = (filePath) => {
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".js")) return "application/javascript";
  if (filePath.endsWith(".html")) return "text/html";
  if (filePath.endsWith(".map")) return "application/json";
  if (filePath.endsWith(".css.map")) return "application/json";
  if (filePath.endsWith(".js.map")) return "application/json";
  return "application/octet-stream";
}

const setResponseHeaders = () => {
  config.SESSION.CLEAR ? session.defaultSession.clearStorageData() : null;
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    let responseHeaders = { ...details.responseHeaders }; 
    Object.entries(config.REQUESTS.ALLOW_HEADERS_LIST).forEach(([key, value]) => {
      responseHeaders[key] = Array.isArray(value) ? value : [value];
    });

    callback({ responseHeaders });
  });
}; 

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  fileProtocolInterceptor();
  setResponseHeaders();
  createWindow();
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      fileProtocolInterceptor();
      setResponseHeaders();
      createWindow();
      app.commandLine.appendSwitch('enable-gpu-rasterization');
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

Routes(BrowserWindow, ipcMain);