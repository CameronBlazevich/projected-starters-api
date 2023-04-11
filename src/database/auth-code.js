const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./my-database.db');

// Function to store user credentials
async function storeAuthCode(userId, authCode) {
  return new Promise((resolve, reject) => {
    console.log(`Storing auth code for user: ${userId} code: ${authCode}`)
    db.run(
      'INSERT OR REPLACE INTO user_yahoo_auth_code (user_id, yahoo_auth_code) VALUES (?, ?)',
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

    const sql = `SELECT uac.yahoo_auth_code
                  FROM user_yahoo_auth_code uac
                  INNER JOIN users u
                    ON u.Id = uac.user_id
                  WHERE u.Email = ?`

    db.get(
      // 'SELECT access_token, refresh_token FROM user_credentials WHERE user_id = ?',
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

module.exports = { getAuthCode, storeAuthCode };
