var db;

module.exports.init = init;
module.exports.getConnection = getConnection;
module.exports.begin = begin;
module.exports.commit = commit;
module.exports.rollback = rollback;
module.exports.release = release;
module.exports.close = close;
module.exports.query = query;
module.exports.squelQuery = squelQuery;
module.exports.limitWithOffset = limitWithOffset;
module.exports.NOW = NOW;

function init(pDbType, pDbConfig) {
    db = require("./" + pDbType + "Wrapper");
    db.init(pDbConfig);
}

function getConnection(pCallback) {    
    db && db.getConnection(pCallback);
}

function begin(pDbCon, pCallback) {
    db && db.begin(pDbCon, pCallback);
}

function commit(pDbCon, pCallback) {
    db && db.commit(pDbCon, pCallback);
}

function rollback(pDbCon, pCallback) {
    db && db.rollback(pDbCon, pCallback);
}

function release(pDbCon) {
    db && db.release(pDbCon);
}

function close(pCallback) {
    db && db.close(pCallback);
    db = null;
}

function query(pDbCon, pQuery, pParams, pCallback) {
    db && db.query(pDbCon, pQuery, pParams, pCallback);
}

function squelQuery(pDbCon, pQuery, pCallback, pCheckId) {
    db && db.squelQuery(pDbCon, pQuery, pCallback, pCheckId);
}

function limitWithOffset(pQuery, pOffset, pRows) {
    return db && db.limitWithOffset(args);
}

function NOW() {
    return db && db.NOW;
}

