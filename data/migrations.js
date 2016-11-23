const fs = require('fs');
const MIGRATIONS_PATH = __dirname + '/migrations';


// autoload all migrations in ./migrations subfolder
// all migrations with _ in name are going to be skipped (usable for debug)
// migration name scheme is: YYYYMMDD-SubVersion-Name.js
module.exports = fs.readdirSync(MIGRATIONS_PATH)
    .filter(m => m.indexOf('_') !== -1)
    .map(m => require(`./migrations/${m}`));
