const UsersController = require('./controllers/usersController');
const LoginController = require('./controllers/loginController');
const ServerController = require('./controllers/serverController');
const StagesController = require('./controllers/stagesController');

exports.init = function(app){
    /*====== USERS ======*/
    app.get('/users', [
        UsersController.getUserByToken
    ], UsersController.getUser);
    app.post('/users', UsersController.postUser);


    /*====== LOGIN ======*/
    app.post('/login', LoginController.login);


    /*====== SERVER =====*/
    app.get('/server', ServerController.get);
    app.get('/server/badge', ServerController.getBadge);


    /*====== STAGES =====*/
    app.get('/stages/:id', StagesController.getOneById);
}
