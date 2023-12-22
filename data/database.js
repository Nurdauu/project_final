// database.js

const mysql = require("mysql2/promise");

let pool;

function createPool() {
  return mysql.createPool({
    host: "localhost",
    database: "project_soft",
    user: "root",
    password: "nurdauletknnn",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

module.exports = {
  getPool: function () {
    if (!pool) {
      pool = createPool();
    }
    return pool;
  },
};
