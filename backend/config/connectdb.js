const sql = require('mssql/msnodesqlv8');
require('dotenv').config();
const server_name= process.env.SERVER_NAME;
const db_name= process.env.DB_NAME;
const sql_port= process.env.SQL_PORT;

const serverName = server_name; 
const databaseName = db_name; 
const sqlPort = sql_port;

module.exports = `Driver={SQL Server Native Client 11.0};Server=${serverName};Database=${databaseName};Trusted_Connection=Yes;`;