const { pool } = require('./postgresDB');


async function createUserTeam(userId, leagueId, teamId) {
    console.log(`Creating user team for userId: ${userId} leagueId: ${leagueId} teamId: ${teamId}`)

    const insertSql = `
    INSERT INTO user_team (user_id, league_id, team_id)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
    `
    try {
        await pool.query(insertSql, [userId, leagueId, teamId]);
    } catch (err) {
        console.error("Something went wrong creating user team:")
        console.error(err);
        throw err;
    }
}


async function getUserTeams(userId) {
    const sql = `
    SELECT * FROM user_team
    WHERE user_id = $1
    `
    try {
        const result = await pool.query(sql, [userId]);
        return result.rows
    } catch (err) {
        console.error("Something went wrong creating user team:")
        console.error(err);
        throw err;
    }
}

module.exports = { createUserTeam, getUserTeams }