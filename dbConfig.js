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
module.exports.limit = limit;
module.exports.limitWithOffset = limitWithOffset;
module.exports.NOW = NOW;
module.exports.dbHandler = dbHandler;

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

function limit(pQuery, pRows) {
    return db && db.limit(pQuery, pRows);
}

function limitWithOffset(pQuery, pOffset, pRows) {
    return db && db.limitWithOffset(pQuery, pOffset, pRows);
}

function NOW() {
    return db && db.NOW;
}

function dbHandler(pfDbOperation, cbError) {
    let __commit = function(pDbCon) {
        db.commit(pDbCon, (err) => {
            if (err) console.log(err);
            db.release(pDbCon);
        });
    };

    let __rollback = function(pDbCon) {
        db.rollback(pDbCon, (err) => {
            if (err) console.log(err);
            db.release(pDbCon);
        });
    };

    if (!db) {
        cbError("Init Error");
    } else {
        db.getConnection( (err, pDbCon) => {
            if (err) {
                console.log(err);
                cbError("Connection Error");
            } else {
                db.begin(pDbCon, (err) => {
                    if (err) {
                        console.log(err);
                        __rollback(pDbCon);
                    } else {
                        try {
                            pfDbOperation(pDbCon
                                , () => { __commit(pDbCon); }
                                , () => { __rollback(pDbCon); }
                            );
                        } catch (e) {
                            console.log(e);
                            __rollback(pDbCon);
                        }
                    }
                });
            }
        });
    }
}
