const {pool} = require('./postgresDB')

async function getAddDropSchedule(userId, leagueId, teamId) {
    const sql = `
        SELECT * FROM add_drop_schedule
        WHERE user_id = $1
        AND league_id = $2
        AND team_id = $3
        -- AND has_executed = false
        ;
    `

     try {
        const result = await pool.query(sql, [userId, leagueId, teamId])
        return result.rows;
     } catch (error) {
        console.error(error);
     }
}

async function getAddDropsToExecute() {
    const sql = `
        SELECT * FROM add_drop_schedule
        WHERE has_executed = false
            AND attempts < 3
            AND CURRENT_TIMESTAMP AT TIME ZONE 'UTC' > earliest_add_time_utc AT TIME ZONE 'UTC'
    `
     try {
        const result = await pool.query(sql)
        return result.rows;
     } catch (error) {
        console.error(error);
     }
}

async function setCompleted(addDropScheduleRecordId) {
    const sql = `
        UPDATE add_drop_schedule
        SET has_executed = true, 
            attempts = attempts + 1
        WHERE id = $1
    `
     try {
        const result = await pool.query(sql, [addDropScheduleRecordId])
        return result.rows[0];
     } catch (error) {
        console.error(error);
     }
}

async function incrementAttempts(addDropScheduleRecordId) {
    const sql = `
        UPDATE add_drop_schedule
        SET attempts = attempts + 1
        WHERE id = $1
    `
     try {
        const result = await pool.query(sql, [addDropScheduleRecordId])
        return result.rows[0];
     } catch (error) {
        console.error(error);
     }
}

async function createAddDropEntry(args) {
    const {userId, addPlayerId, dropPlayerId, leagueId, teamId, earliestAddTimeUtc} = args;

    const insertSql = `
    INSERT INTO add_drop_schedule (user_id, add_player_id, drop_player_id, league_id, team_id, earliest_add_time_UTC)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
    `
    try {
        await pool.query(insertSql, [userId, addPlayerId, dropPlayerId, leagueId, teamId, earliestAddTimeUtc]);
        const scheduled = await getAddDropSchedule(userId, leagueId, teamId);
        return scheduled;
    } catch (err) {
        console.error("Something went wrong creating add/drop record:")
        console.error(err);
        throw err;
    }
}

async function removeAddDropEntry(args) {
    const {userId, addPlayerId, dropPlayerId, leagueId, teamId, earliestAddTimeUtc} = args;

    const deleteSql = `
    DELETE FROM add_drop_schedule 
        WHERE user_id = $1
        AND add_player_id = $2
        AND drop_player_id = $3
        AND league_id = $4
        AND team_id = $5
    `
    try {
        await pool.query(deleteSql, [userId, addPlayerId, dropPlayerId, leagueId, teamId]);
        const scheduled = await getAddDropSchedule(userId, leagueId, teamId);
        return scheduled;
    } catch (err) {
        console.error("Something went wrong creating add/drop record:")
        console.error(err);
        throw err;
    }
}

module.exports = {createAddDropEntry, getAddDropSchedule, removeAddDropEntry, getAddDropsToExecute, setCompleted, incrementAttempts}