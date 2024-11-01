const db = require('../../DB/mysql');

const TABLE = 'users';

function all(){
    return db.all(TABLE);
}

module.exports = {
    all,
}