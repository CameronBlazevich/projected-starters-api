const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./my-database.db');

// Function to store user credentials
async function storeAuthCode(userId, authCode) {
  return new Promise((resolve, reject) => {
    console.log(`Storing auth code for user: ${userId} code: ${authCode}`)
    db.run(
      'INSERT OR REPLACE INTO user_yahoo_info (user_id, yahoo_auth_code) VALUES (?, ?)',
      [userId, authCode],
      function (err) {
        if (err) {
            console.error(`Error store auth code ${err}`)
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

// Function to retrieve user credentials
async function getAuthCode(userEmail) {
  return new Promise((resolve, reject) => {

    const sql = `SELECT uyi.yahoo_auth_code
                  FROM user_yahoo_info uyi
                  INNER JOIN users u
                    ON u.Id = uyi.user_id
                  WHERE u.Email = ?`

    db.get(
      sql,
      [userEmail],
      function (err, row) {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error(`Yahoo Auth Code not found for user ${userEmail}`));
        } else {
          resolve(row);
        }
      }
    );
  });
}

async function getInfo(user) {
  return new Promise((resolve, reject) => {

    const sql = `SELECT uyi.yahoo_auth_code, uyi.yahoo_league_id, uyi.yahoo_team_id
                  FROM user_yahoo_info uyi
                  INNER JOIN users u
                    ON u.Id = uyi.user_id
                  WHERE u.Id = ?`

    db.get(
      sql,
      [user.user_id],
      function (err, row) {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error(`No Yahoo info for user with email: ${user.Email}`));
        } else {
          resolve(row);
        }
      }
    );
  });
}

module.exports = { getAuthCode, storeAuthCode, getInfo };
