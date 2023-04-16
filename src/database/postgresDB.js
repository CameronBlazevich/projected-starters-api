const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

//Local Dev:
// const pool = new Pool({
//   user: "postgres",
//   database: "SPxRay",
// //   password: "password",
//   port: 5432,
//   host: "localhost",
// });

const pool = new Pool({
  connectionString: connectionString, 
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = { pool };