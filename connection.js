const { Client } = require("pg");
const client = new Client({
  user: "com118",
  host: "localhost",
  database: "dbsignup",
  password: "12345",
  port: 5432,
});
module.exports = client;
