'use strict';

const SETTINGS = require('../enums/settings');
const logger = require('./logger').child({widget_type: 'migrations'});

const migrations = require('../data/migrations');

exports.init = function(options){
    const Settings = require('../db/settings');

    function applyMigrations(err, DBVersionAttribute){
        return new Promise((res, rej) => {
            function migrationHandler(){
                logger.info(`Looking at migration(index=${index})`);

                if (index < migrations.length){
                    logger.info(`Execute migration(index=${index})`);
                    migrations[index].call(this, null, (err) => {
                        if (err){
                            logger.fatal(err);
                            process.exit(1);
                        }

                        index ++;
                        DBVersionAttribute.value = index.toString();
                        DBVersionAttribute.save(migrationHandler);
                    });
                } else {
                    logger.info('Stop migrations execution');
                    res();
                }
            }

            if (err){
                logger.fatal(err);
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
