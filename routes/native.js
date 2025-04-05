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

    // DB table routes
    Router.post('/createTable', 'AuthController@createTable'); 

    // Auth routes
    Router.get('/signup', 'AuthController@registerUser'); 
    Router.get('/login', 'AuthController@loginUser'); 
    Router.post('/loginUser', 'AuthController@loginUsers');
    Router.post('/registerUser', 'AuthController@saveUsers');
    Router.get('/forgotpassword', 'AuthController@forgotPasswordView'); 
    Router.get('/resetpassword', 'AuthController@resetPasswordView'); 
    Router.post('/forgot-password', 'AuthController@forgotPassword');
    Router.post('/reset-password', 'AuthController@resetPassword');
    Router.post('/logoutUser', 'AuthController@logoutUser');

    // Dashboard routes
    Router.get('/dashboard', 'DashboardController@index'); 
} 

module.exports = Routes;

