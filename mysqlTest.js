var pDb = require("./dbConfig");
var squel = require('squel');

const mysqlConfig = {
    host     : 'localhost',
    user     : 'testuser',
    password : 'testpassword',
    database : 'nodetest',
    connectionLimit : 10
};

pDb.init("mysql", mysqlConfig);

setTimeout(function() {
    pDb.getConnection( (err, pDbCon) => {
        if (err) {
            console.log(err);
        } else {
          pDb.dbHandler(
              (pDbCon, cbSuccess, cbError) => {
                  pDb.squelQuery(pDbCon, "select count(*) as cnt from test_table", (err, results) => {
                      if (err) {
                          cbError();
                      } else {
                          console.log(results);
                          cbSuccess();
                      }
                  } );
              }
              , (err) => {
                  console.log(err);
              }
          );
        }
    });
}, 1000);

setTimeout(function() {
    pDb.close();
}, 2000);
