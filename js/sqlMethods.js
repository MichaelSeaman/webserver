const mysql = require('mysql');

/*var pool = mysql.createPool({
  host  : 'us-cdbr-azure-west-b.cleardb.com',
  user  : 'be234364e375d8',
  password  : 'e60754d2',
  database  : 'acsm_676dbbe84ea3d8c',
  debug : false,
  multipleStatements : true,
  queneLimit  : 200
});*/
var pool = mysql.createPool({
  host  : 'us-cdbr-azure-west-b.cleardb.com',
  user  : 'be234364e375d8',
  password  : 'e60754d2',
  database  : 'acsm_676dbbe84ea3d8c',
  debug : false,
  multipleStatements : true,
  queneLimit  : 200,
  connectionLimit : 2
});

function endPool() {
  pool.end();
}

function executeUpdate(updateString, callback) {
  outStream = callback || console.log;
  var affectedRows = -1;

  pool.getConnection(function (err, connection) {
    if(err) throw err;
    console.log(updateString + " has connected with ID: " + connection.threadId);

    connection.query(updateString, function (err, result) {
      connection.release();
      if(err) throw err;
      affectedRows = result.affectedRows;
      outStream(affectedRows);
    });
  })
}

function executeQuery(queryString, callback) {
  outStream = callback || console.log;
  var output = {};

  pool.getConnection(function (err, connection) {
    if(err) throw err;
    console.log(queryString + " has connected with ID: " + connection.threadId);

    connection.query(queryString, function (err, rows) {
      connection.release();
      if(err) throw err;
      output = rows;
      outStream(output);
    });

  });

}

function displayTable(tableName, callback) {
  var queryString = "SELECT * FROM ?? WHERE deleted = 'false';";
  var inserts = [tableName];
  queryString = mysql.format(queryString, inserts);
  executeQuery(queryString, callback);
}


module.exports.displayTable = displayTable;
module.exports.executeUpdate = executeUpdate;
module.exports.executeQuery = executeQuery;
module.exports.endPool = endPool;
