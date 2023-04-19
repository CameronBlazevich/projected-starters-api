const { pool } = require('./postgresDB');

async function getUserLeagues(userId) {
    // console.log(`Getting user leagues for userId: ${userId}`);

    const getSql = `
    SELECT ul.league_id as league_id, 
        ul.league_type_id as league_type_id, 
        ut.team_id as team_id 
    FROM user_league ul
        LEFT JOIN user_team ut ON ul.league_id = ut.league_id AND ul.user_id = ut.user_id
    WHERE ul.user_id = $1
    `

    try {
        const result = await pool.query(getSql, [userId]);
        return result.rows;
    } catch (err) {
        console.error("Something went wrong getting user leagues:")
        console.error(err);
        throw err;
    }
}

async function createUserLeague(userId, leagueId, leagueTypeId) {
    console.log(`Creating user league for userId: ${userId} leagueId: ${leagueId}`)

    const insertSql = `
    INSERT INTO user_league (user_id, league_id, league_type_id)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
    `
    try {
        await pool.query(insertSql, [userId, leagueId, leagueTypeId]);
        const allLeagues = await getUserLeagues(userId);
        return allLeagues;
    } catch (err) {
        console.error("Something went wrong creating user league:")
        console.error(err);
        throw err;
    }
}

async function deleteUserLeague(userId, leagueId) {
    console.log(`Deleting user league for userId: ${userId} leagueId: ${leagueId}`);

    const deleteTeamSql = `
        DELETE FROM user_team
        WHERE user_id = $1
            AND league_id = $2
    `

    const deleteSql = `
        DELETE FROM user_league
        WHERE user_id = $1
            AND league_id = $2
    `

    try {
        await pool.query(deleteTeamSql, [userId, leagueId])
        await pool.query(deleteSql, [userId, leagueId]);
        const remainingLeagues = getUserLeagues(userId);
        return remainingLeagues;
    } catch (err) {
        console.error("Something went wrong getting user leagues:")
        console.error(err);
        throw err;
    }
}

module.exports = { getUserLeagues, createUserLeague, deleteUserLeague }