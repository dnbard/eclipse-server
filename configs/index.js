'use strict';

const debug = require('debug')('configs');
const convict = require('convict');

// Define a schema
let conf = convict({
    env: {
        doc: 'The applicaton environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    debug: {
        ui: {
            doc: 'Debug for ui',
            format: Boolean,
            default: false,
            env: 'DEBUG_UI'
        }
    },
    server: {
        ip: {
            doc: 'The IP address to bind.',
            format: 'ipaddress',
            default: '0.0.0.0',
            env: 'IP_ADDRESS',
        },
        port: {
            doc: 'The port to bind.',
            format: 'port',
            default: 3000,
            env: 'PORT'
        }
    },
    mongo: {
        url: {
            doc: 'Database url',
            format: String,
            default: 'mongodb://127.0.0.1:27017/eclipse',
            env: 'MONGO_URL'
        }
    },
    stage: {
        default: {
            doc: 'Default stage id',
            format: String,
            default: 'ce44bd18-b408-492f-b561-0d8f1a8c5421',
            env: 'STAGE_DEFAULT'
        }
    },
    secret: {
        doc: 'Secret key for password encryption',
        format: String,
        default: 'U2FsdGVkX19LTE8mlF/Ta7ahEWkqgwsjD8Fc9c2UnMU=',
        env: 'SECRET'
    }
});

// Load environment dependent configuration
let env = conf.get('env');
let configPath = `${__dirname}/${env}.json`;

debug(`Loading config file: '${configPath}'`);
conf.loadFile(configPath);

// Perform validation
conf.validate({strict: true});

debug('Config is loaded');

module.exports = conf;
