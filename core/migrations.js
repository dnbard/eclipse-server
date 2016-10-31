const SETTINGS = require('../enums/settings');

const migrations = require('../data/migrations');

exports.init = function(options){
    const Settings = require('../db/settings');

    function applyMigrations(err, DBVersionAttribute){
        return new Promise((res, rej) => {
            function migrationHandler(){
                console.log(`Looking at migration(index=${index})`);

                if (index < migrations.length){
                    console.log(`Execute migration(index=${index})`);
                    migrations[index].call(this, null, (err) => {
                        if (err){
                            console.error(err);
                            process.exit(1);
                        }

                        index ++;
                        DBVersionAttribute.value = index.toString();
                        DBVersionAttribute.save(migrationHandler);
                    });
                } else {
                    console.log('Stop migrations execution');
                    res();
                }
            }

            if (err){
                console.error(err);
                process.exit(1);
            }

            var index = parseInt(DBVersionAttribute.value);
            migrationHandler();
        });
    }


    return Settings.findOne({ _id: SETTINGS.DB_VERSION }).exec().then((setting) => {
        const createOrUseExistingSetting = !setting ?
            //no db-version attribute found and we must create one
            Settings.createOne(SETTINGS.DB_VERSION, 0) :
            Promise.resolve(setting);

        return createOrUseExistingSetting.then(setting => applyMigrations(null, setting));
    });
}
