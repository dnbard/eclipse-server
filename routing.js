const UsersController = require('./controllers/usersController');
const LoginController = require('./controllers/loginController');
const ServerController = require('./controllers/serverController');


exports.init = function(app){
    /*====== USERS ======*/
    app.get('/users', [UsersController.getUserByToken], UsersController.getUser);
    app.post('/users', UsersController.postUser);


    /*====== LOGIN ======*/
    app.post('/login', LoginController.login);


    /*====== SERVER =====*/
    app.get('/server', ServerController.get);
}
