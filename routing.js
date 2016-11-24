const UsersController = require('./controllers/usersController');
const LoginController = require('./controllers/loginController');
const ServerController = require('./controllers/serverController');
const StagesController = require('./controllers/stagesController');
const ShipsController = require('./controllers/shipsController');
const RigsController = require('./controllers/rigsController');


exports.init = function(app){
    /*====== USERS ======*/
    app.get('/users',
        [ UsersController.getUserByToken ],
        UsersController.getUser
    );
    app.post('/users', UsersController.postUser);

    app.get('/users/pvp', UsersController.getUsersByRating);


    /*====== LOGIN ======*/
    app.post('/login', LoginController.login);


    /*====== SERVER =====*/
    app.get('/server', ServerController.get);
    app.get('/server/badge', ServerController.getBadge);


    /*====== STAGES =====*/
    app.get('/stages/:id', StagesController.getOneById);


    /*====== SPACESHIPS =*/
    app.get('/spaceships/:id', ShipsController.getOneById);


    /*====== RIGS =======*/
    app.get('/storage/:id/rigs',
        [ UsersController.getUserByToken ],
        RigsController.getFew
    );

    app.post('/storage/:id/rigs/:rigId/equip',
        [ UsersController.getUserByToken ],
        RigsController.equip
    );
    app.post('/storage/:id/rigs/:rigId/unequip',
        [ UsersController.getUserByToken ],
        RigsController.unequip
    );
}
