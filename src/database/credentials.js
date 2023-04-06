const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./my-database.db');

// Function to store user credentials
async function storeCredentials(userId, accessToken, refreshToken) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO user_credentials (user_id, access_token, refresh_token) VALUES (?, ?, ?)',
      [userId, accessToken, refreshToken],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

// Function to retrieve user credentials
async function getCredentials(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT access_token, refresh_token FROM user_credentials WHERE user_id = ?',
      [userId],
      function (err, row) {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error(`Credentials not found for user ${userId}`));
        } else {
          resolve(row);
        }
      }
    );
  });
}

module.exports = { getCredentials, storeCredentials };
