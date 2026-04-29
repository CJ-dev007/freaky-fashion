const Database = require('better-sqlite3');
const path = require('path');

// Detta gör att den alltid hittar filen oavsett var du startar appen ifrån
const db = new Database(path.join(__dirname, 'freakyfashion.db'), {
    verbose: console.log
});

module.exports = db;
