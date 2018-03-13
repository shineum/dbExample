const mysql = require('mysql');

module.exports.init = init;
module.exports.getConnection = getConnection;
module.exports.begin = begin;
module.exports.commit = commit;
module.exports.rollback = rollback;
module.exports.release = release;
module.exports.close = close;
module.exports.query = query;
module.exports.squelQuery = squelQuery;
module.exports.limit = limit;
module.exports.limitWithOffset = limitWithOffset;
module.exports.NOW = 'NOW()';

var pool;

function init(pConfig) {
    pool = mysql.createPool(pConfig, (err) => {
        if (err) console.log(err);
    });
}

function getConnection(pCallback) {
    pool.getConnection(pCallback);
}

function begin(pDbCon, pCallback) {
    pDbCon.beginTransaction(pCallback);
}

function commit(pDbCon, pCallback) {
    pDbCon.commit(pCallback);
}

function rollback(pDbCon, pCallback) {
    pDbCon.rollback(pCallback);
}

function release(pDbCon) {
    pDbCon.release();
}

function close(pCallback) {
    pool && pool.end(pCallback);
}

function query(pDbCon, pQuery, pParams, pCallback) {

    // implement here

    typeof pCallback === 'function' && pCallback();
}

function squelQuery(pDbCon, pQuery, pCallback, pCheckId) {
    pDbCon.query(pQuery, (err, result, fields) => {
        pCallback(err, result, fields);
    });
}

function limit(pQuery, pRows) {
    return pQuery + " limit " + pRows;
}

function limitWithOffset(pQuery, pOffset, pRows) {
    return pQuery + " limit " + pOffset + ", " + pRows;
}
