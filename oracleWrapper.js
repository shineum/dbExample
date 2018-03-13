const oracledb = require('oracledb');

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
module.exports.NOW = 'SYSDATE';

var pool;

function init(pConfig) {
    oracledb.createPool(pConfig, (err, pPool) => {
        if (err) console.log(err);
        else pool = pPool;
    });
}

function getConnection(pCallback) {
    pool.getConnection(pCallback);
}

function begin(pDbCon, pCallback) {
    pCallback();
}

function commit(pDbCon, pCallback) {
    pDbCon.commit(pCallback);
}

function rollback(pDbCon, pCallback) {
    pDbCon.rollback(pCallback);
}

function release(pDbCon) {
    pDbCon.close();
}

function close(pCallback) {
    pool && pool.close(pCallback || (()=>{}));
}

function query(pDbCon, pQuery, pParams, pCallback) {

    // implement here

    typeof pCallback === 'function' && pCallback();
}

function convertResult(result) {
    var tRet = [];
    var tKeys = [];
    result.metaData.forEach( (pDat) => {
        tKeys.push(pDat.name);
    } );
    result.rows.forEach( (pRow) => {
        var tObj = {};
        tKeys.forEach( (pKey, pIdx) => {
            tObj[pKey] = pRow[pIdx];
        } );
        tRet.push(tObj);
    } );
    return tRet;
}

function squelQuery(pDbCon, pQuery, pCallback, pCheckId) {
    pDbCon.execute(pQuery, [], (err, result) => {
        if (err) {
            pCallback(err);
        } else if (result && result.metaData) {
            pCallback(err, convertResult(result));
        } else {
            if (pCheckId) {
                var tTableName = pQuery.trim().replace(/\s+/g, " ").split(" ")[2].toUpperCase();
                var tQueryForPk = "SELECT cols.column_name as pk"
                    + " FROM all_constraints cons, all_cons_columns cols"
                    + " WHERE cols.table_name = '" + tTableName + "'"
                    + " AND cons.constraint_type = 'P'"
                    + " AND cons.constraint_name = cols.constraint_name"
                    + " AND cons.owner = cols.owner"
                    + " ORDER BY cols.table_name, cols.position";
                pDbCon.execute(tQueryForPk, [], (err, result) => {
                    var tPkCol = result.rows[0][0];
                    var tQueryForId = "SELECT max(" + tPkCol + ") as id from " + tTableName;
                    pDbCon.execute(tQueryForId, [], (err, result) => {
                        pCallback(err, {insertId: result.rows[0][0]});
                    } );
                } );
            } else {
                pCallback(err, {});
            }
        }
    });
}

function limit(pQuery, pRows) {
    // oracle 12 only
    return pQuery + " FETCH NEXT " + pRows + " ROWS ONLY";
}

function limitWithOffset(pQuery, pOffset, pRows) {
    // oracle 12 only
    return pQuery + " OFFSET " + pOffset + " ROWS FETCH NEXT " + pRows + " ROWS ONLY";
}
