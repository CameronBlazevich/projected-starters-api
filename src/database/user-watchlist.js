const { pool } = require('./postgresDB');

async function addWatchlistEntry(args) {
    const { playerId, playerIdTypeId, leagueId, gameId, userId, gameTime } = args;

    const insertSql = `
        INSERT INTO user_watchlist (user_id, player_id, player_id_type_id, league_id, game_id, game_datetime)
        VALUES ($1, $2, $3, $4, $5, $6);
    `;

    try {
        await pool.query(insertSql, [userId, playerId, playerIdTypeId, leagueId, gameId, gameTime]);
    } catch (err) {
        console.error(err);
        throw err;
    }

}

async function getWatchlist(userId, leagueId) {
    try {
    const sql = `
        SELECT * FROM user_watchlist
        WHERE user_id = $1
            AND league_id = $2
    `

    const result = await pool.query(sql, [userId, leagueId])
    return result.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = { addWatchlistEntry, getWatchlist }







// CREATE TABLE IF NOT EXISTS user_watchlist(
//     id serial NOT NULL PRIMARY KEY,
//     user_id INTEGER NOT NULL,
//     player_id VARCHAR(200),
//     player_id_type_id INTEGER,
//     league_id VARCHAR(150),
//     game_id INTEGER NOT NULL,
//     game_datetime TIMESTAMP,
//     FOREIGN KEY(player_id_type_id) REFERENCES player_id_type(player_id_type_id),
//     FOREIGN KEY(league_id, user_id) REFERENCES user_league(league_id, user_id),
//     FOREIGN KEY(user_id) REFERENCES users(id)
// );