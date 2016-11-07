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
