const { pool } = require('./postgresDB');

async function storeAuthCode(userId, authCode) {
  console.log(`Storing auth code for user: ${userId} code: ${authCode}`)

  const getSql = `
    SELECT * FROM user_yahoo_info
    WHERE user_id = $1;
  `

  const insertSql = `
    INSERT INTO user_yahoo_info(user_id, auth_code)
    VALUES($1, $2)
    RETURNING *
    `;

  const updateSql = `
  UPDATE user_yahoo_info
      SET auth_code = $2
      WHERE user_id = $1
      RETURNING *;
  `;

  try {

    const existing = await pool.query(getSql, [userId])
    const doesExist = existing?.rowCount > 0;
    // console.log(`does exist? ${does}`)
    let res;
    if (doesExist) {
      res = await pool.query(updateSql, [userId, authCode])
    } else {
      res = await pool.query(insertSql, [userId, authCode]);
    }
    
    return res;
  } catch (err) {
    console.error("Something went wrong storing the auth code:")
    console.error(err);
  }
}

async function getAuthCode(userId) {
  const sql = `
  SELECT auth_code
    FROM user_yahoo_info
    WHERE user_id = $1`

  try {
    const res = await pool.query(sql, [userId])
    return res.rows[0];
  } catch (err) {
    console.error("Something went wrong getting the auth code:")
    console.error(err);
  }

}

async function getInfo(user) {

  const sql = `SELECT auth_code, league_id, team_id
                  FROM user_yahoo_info
                  WHERE user_id = $1`

  try {
    const res = await pool.query(sql, [user.user_id])
    return res.rows[0];
  } catch (err) {
    console.error("Something went wrong getting the yahoo info:")
    console.error(err);
  }
}

async function storeApiCreds(userId, accessToken, refreshToken) {
  console.log(`Storing api creds for user: ${userId}`)

  const getSql = `
    SELECT * FROM user_yahoo_info
    WHERE user_id = $1;
  `
  const updateSql = `
  UPDATE user_yahoo_info
  SET access_token = $2,
    refresh_token = $3
  WHERE user_id = $1
  RETURNING *`;

  const insertSql = `
    INSERT INTO user_yahoo_info(user_id, access_token, refresh_token)
    VALUES($1, $2, $3)
    RETURNING *`;

  try {
    let res;
    const existing = await pool.query(getSql, [userId]);
    const doesRecordExist = existing?.rowCount > 0
    if (doesRecordExist) {
      res = await pool.query(updateSql, [userId, accessToken, refreshToken])
    } else {
       res = await pool.query(insertSql, [userId, accessToken, refreshToken])
  }
    return res;
  } catch (err) {
    console.error("Something went wrong storing the api creds:")
    console.error(err);
  }
}

async function getApiCreds(userId) {

  const sql = `SELECT access_token, refresh_token
                  FROM user_yahoo_info
                  WHERE user_id = $1`

  try {
    const res = await pool.query(sql, [userId])
    return res.rows[0];
  } catch (err) {
    console.error("Something went wrong getting the yahoo info:")
    console.error(err);
  }
}

module.exports = { getAuthCode, storeAuthCode, getInfo, storeApiCreds, getApiCreds };
