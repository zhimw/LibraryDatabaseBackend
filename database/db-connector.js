require("dotenv").config();

// Get an instance of mysql we can use in the app
var mysql = require("mysql2");

const dbConn = mysql.createConnection({
    connectionLimit: process.env.connectionLimit,
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
});
dbConn.connect(err => {
    if (err) throw err;
    console.log('Connected!');
});

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
  connectionLimit: process.env.connectionLimit,
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});


// Export it for use in our applicaiton
module.exports.pool = pool;
