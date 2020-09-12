const mysql = require("mysql");
const util = require("util");

function makeDb() {
  const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "&_Q32y^HuOwp",
    database: "employeesDB",
  });

  return {
    query(sql, args) {
      return util.promisify(connection.query)
        .call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
}

module.exports = makeDb();
