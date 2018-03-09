const mssql = require('mssql');

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
module.exports.NOW = 'CURRENT_TIMESTAMP';

var pool;

function init(pConfig) {
    pool = new mssql.ConnectionPool(pConfig, (err) => {
        if (err) console.log(err);
    });
}

function getConnection(pCallback) {
    var transaction = new mssql.Transaction(pool);
    pCallback(!transaction && "Connection Error", transaction);
}

function begin(pDbCon, pCallback) {
    pDbCon.begin(pCallback);
}

function commit(pDbCon, pCallback) {
    pDbCon.commit(pCallback);
}

function rollback(pDbCon, pCallback) {
    pDbCon.rollback(pCallback);
}

function release(pDbCon) {
}

function close(pCallback) {
    pool && pool.close();
    typeof pCallback === 'function' && pCallback();
}

function query(pDbCon, pQuery, pParams, pCallback) {

    // implement here

    typeof pCallback === 'function' && pCallback();
}

function squelQuery(pDbCon, pQuery, pCallback, pCheckId) {
    if (pCheckId) {
        pQuery += "; select SCOPE_IDENTITY() as id";
    }        
    new mssql.Request(pDbCon).query(pQuery, (err, result) => {
        if (pCheckId) {
            pCallback(err, {insertId: result.recordset[0].id});
        } else {
            pCallback(err, result && result.recordset);
        }        
    });    
}

function limitWithOffset(pQuery, pOffset, pRows) {
    return pQuery + " OFFSET " + pOffset + " ROWS FETCH NEXT " + pRows + " ROWS ONLY";
}

