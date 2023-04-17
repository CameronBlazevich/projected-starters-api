const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

let pool;
if (isProduction) {
  pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  //Local Dev:
  pool = new Pool({
    user: "postgres",
    database: "SPxRay",
    //   password: "password",
    port: 5432,
    host: "localhost",
  });

}

module.exports = { pool };