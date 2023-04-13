const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt')

const init = () => {
  const db = new sqlite3.Database('./my-database.db');

  var salt = bcrypt.genSaltSync(10);
  db.run(
    `
  CREATE TABLE IF NOT EXISTS users (
    Id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    Email text, 
    Password text,             
    Salt text,    
    Token text,
    DateLoggedIn DATE,
    DateCreated DATE
  )
`,
    (err) => {
      if (err) {
        console.error('Error creating users table:', err);
        process.exit(1);
      } else {
        console.log('user table created successfully.');
        // var insert = 'INSERT INTO Users (Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
        //         db.run(insert, ["user1@example.com", bcrypt.hashSync("user1", salt), salt, Date('now')])
        //         db.run(insert, ["user2@example.com", bcrypt.hashSync("user2", salt), salt, Date('now')])
        //         db.run(insert, ["user3@example.com", bcrypt.hashSync("user3", salt), salt, Date('now')])
        //         db.run(insert, ["user4@example.com", bcrypt.hashSync("user4", salt), salt, Date('now')])
        // You can now start using the database
      }
    }
  );

  db.run(
    `
  CREATE TABLE IF NOT EXISTS user_credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    FOREIGN KEY (user_id) REFERENCES users(Id)
  )
`,
    (err) => {
      if (err) {
        console.error('Error creating user_credentials table:', err);
        process.exit(1);
      } else {
        console.log('user_credentials table created successfully');
        // You can now start using the database
      }
    }
  );

  db.run(
    `
  CREATE TABLE IF NOT EXISTS user_yahoo_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    yahoo_auth_code TEXT,
    yahoo_league_id TEXT,
    yahoo_team_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(Id)
  )
`,
    (err) => {
      if (err) {
        console.error('Error creating user_yahoo_info table:', err);
        process.exit(1);
      } else {
        console.log('user_yahoo_info table created successfully');
        // You can now start using the database
      }
    }
  );


};

module.exports = { init };
