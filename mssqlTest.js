var pDb = require("./dbConfig");
var squel = require('squel');

const mssqlConfig = {
    user: 'testuser',
    password: 'testpassword',
    server: 'localhost', 
    port: 50053,
    database: 'nodetest',
    pool: {
        max: 10,
        min: 0
    }         
}

pDb.init("mssql", mssqlConfig);

setTimeout(function() {
    pDb.getConnection( (err, pDbCon) => {
        if (err) {
            console.log(err);
        } else {
            pDb.begin(pDbCon, (err) => {
                if (err) {
                    console.log(err);
                    pDb.rollback(pDbCon, (err) => {
                        if (err) console.log(err);
                        pDb.release(pDbCon);
                    });
                } else {
                    pDb.squelQuery(pDbCon, "select count(*) as cnt from test_table", (err, results) => {
                        if (err) {
                            console.log(err);
                            pDb.rollback(pDbCon, (err) => {
                                if (err) console.log(err);
                                pDb.release(pDbCon);
                            });
                        } else {
                            console.log(results);
                            pDb.commit(pDbCon, (err) => {
                                if (err) console.log(err);
                                pDb.release(pDbCon);
                            });
                        }
                    });
                }
            });
        }    
    });
}, 1000);

setTimeout(function() {
    pDb.close();
}, 2000);
