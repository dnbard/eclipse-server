const UsersController = require('./controllers/usersController');
const LoginController = require('./controllers/loginController');


exports.init = function(app){
    /*====== USERS ======*/
    app.get('/users', [UsersController.getUserByToken], UsersController.getUser);
    app.post('/users', UsersController.postUser);

    /*====== LOGIN ======*/
    app.post('/login', LoginController.login);
}
