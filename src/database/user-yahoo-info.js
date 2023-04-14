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

async function getInfo(userId) {

  const sql = `
    SELECT ul.user_id, uy.auth_code, ul.league_id, ut.team_id
        FROM user_league ul
          LEFT JOIN user_yahoo_info uy ON uy.user_id = ul.user_id
          LEFT JOIN user_team ut ON ul.user_id = ut.user_id AND ul.league_id = ut.league_id
        WHERE ul.user_id = $1
    `

  try {
    const res = await pool.query(sql, [userId])
    return res.rows[0]; // ToDo: For now only one league is supported so just retuning first row
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
    return res.rows[0];
  } catch (err) {
    console.error("Something went wrong storing the api creds:")
    console.error(err);
  }
}

async function getUserYahooInfo(userId) {
  const sql = `SELECT *
  FROM user_yahoo_info
  WHERE user_id = $1`

  try {
    const res = await pool.query(sql, [userId])
    return res.rows[0];
  } catch (err) {
    console.error("Something went wrong getting the user yahoo info:")
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

async function setLeagueId(userId, leagueId, leagueTypeId) {
  const insertSql = `
      INSERT INTO user_league(user_id, league_id, league_type_id)
      VALUES($1, $2, $3)
      ON CONFLICT DO NOTHING;
    `;

  try {
      await pool.query(insertSql, [userId, leagueId, leagueTypeId])
    
    return {user_id: userId, league_id: leagueId, league_type_id: leagueTypeId};
  } catch (err) {
    console.error("Something went wrong saving leagueId:")
    console.error(err);
  }
}



module.exports = { getAuthCode, storeAuthCode, getInfo, storeApiCreds, getApiCreds, setLeagueId, getUserYahooInfo };
