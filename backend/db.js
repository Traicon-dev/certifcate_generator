const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",      
    user: "root",           
    password: "",  
    database: "certificates_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const db = pool.promise();

module.exports = db;
