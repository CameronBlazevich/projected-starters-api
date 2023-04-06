const sqlite3 = require('sqlite3').verbose();

const init = () => {
  const db = new sqlite3.Database('./my-database.db');

  db.run(
    `
  CREATE TABLE IF NOT EXISTS user_credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE,
    access_token TEXT,
    refresh_token TEXT
  )
`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err);
        process.exit(1);
      } else {
        console.log('Table created successfully');
        // You can now start using the database
      }
    }
  );
};

module.exports = { init };
