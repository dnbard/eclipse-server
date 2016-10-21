const mongo = require('./mongo');
const COLLECTIONS = require('../enums/collections');
const SETTINGS = require('../enums/settings');

exports.init = function(options, cb){
    const db = mongo.getDatabase();
    const _Settings = db.collection(COLLECTIONS.SETTINGS);
    const Settings = require('../db/settings');

    function applyMigrations(err, DBVersionAttribute){
    //     function migrationHandler(){
    //         console.log(`Migration(index=${index})`);
    //
    //         if (index < migrations.length){
    //             console.log(`Execute migration(index=${index})`);
    //             migrations[index].call(this, null, (err) => {
    //                 if (err){
    //                     console.error(err);
    //                     process.exit(1);
    //                 }
    //
    //                 index ++;
    //                 DBVersionAttribute.value = index.toString();
    //                 DBVersionAttribute.save(migrationHandler);
    //             });
    //         } else {
    //             console.log('Stop migration execution');
    //             cb(null);
    //         }
    //     }
    //
        if (err){
            console.error(err);
            process.exit(1);
        }

        var index = parseInt(DBVersionAttribute.value);
        migrationHandler();
    }

    options = options || {};
    var promise = null;

    _Settings.findOne({ _id: SETTINGS.DB_VERSION }, (err, attr) => {
        if (err){
            return cb(err);
        }

        if (!attr){
            //no db-version attribute found and we must create one
            promise = Settings.createOne(SETTINGS.DB_VERSION, 0)
        } else {
            promise = Promise.resolve(attr);
        }

        return promise.then((setting) => {

        });
    });
}
