const UsersController = require('./controllers/usersController');


exports.init = function(app){
    /*====== USERS ======*/
    app.get('/users', [UsersController.getUserByToken], UsersController.getUser)
    app.post('/users', UsersController.postUser);
}
