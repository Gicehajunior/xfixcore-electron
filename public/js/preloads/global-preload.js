require("dotenv").config();
require('module-alias/register');
const XFIXCore = require("@config/app/XFIXCore"); 
const preloads = require("@config/preloads");   

window.addEventListener("DOMContentLoaded", () => {
    try { 
        (new XFIXCore()).initApplication(preloads); 
    } catch (error) {
        console.error("Error in application initialization:", error);
    }
});
