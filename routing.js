const UsersController = require('./controllers/usersController');


exports.init = function(app){
    app.post('/users', UsersController.postUser);
}
