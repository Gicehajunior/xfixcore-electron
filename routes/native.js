const RouterService = require("@config/services/RouterService");

/**
 * PUT your routes here, 
 * They help in handling requests from the USER INTERFACE.
 * 
 * The requests include, POST, GET, PUT, UPDATE, DELETE:
 * 
 * @return response
 */
const Routes = (BrowserWindow, ipcMain) => {    
    const Router = new RouterService(BrowserWindow, ipcMain); 

    Router.post('createTable', 'AuthController@createTable', "create-table"); 

    Router.get('/signup', 'AuthController@registerUser'); 
    Router.get('/login', 'AuthController@loginUser'); 
    Router.post('loginUser', 'AuthController@loginUsers', "login-response");
    Router.post('registerUser', 'AuthController@saveUsers', "save-users");

    Router.get('/forgotpassword', 'AuthController@forgotPasswordView'); 
    Router.get('/resetpassword', 'AuthController@resetPasswordView'); 
    Router.post('/forgot-password', 'AuthController@forgotPassword', "forgot-password-response");
    Router.post('/reset-password', 'AuthController@resetPassword', "reset-password-response");

    Router.post('/logoutUser', 'AuthController@logoutUser');
} 

module.exports = Routes;

