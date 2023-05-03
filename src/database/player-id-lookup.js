const { pool } = require('./postgresDB');

async function getByYahooId(yahooPlayerId) {
    const sql = `
        SELECT * FROM player_id_lookup
        WHERE yahooid = $1;
    `
    try {
        const results = await pool.query(sql, [yahooPlayerId]);
        return results.rows[0];
    } catch (err) {
        console.error("Something went wrong")
        console.error(err);
        throw err;
    }
}

async function getMlbIdsFromYahooIds(yahooIdArray) {
    const sql = `
        SELECT mlbid, yahooid FROM player_id_lookup
        WHERE yahooid = ANY($1::int[]);
    `
    try {
        const results = await pool.query(sql, [yahooIdArray]);
        return results.rows;
    } catch (err) {
        console.error("Something went wrong")
        console.error(err);
        throw err;
    }
}

async function getMlbIdFromYahooName(yahooName) {
    const sql = `
        SELECT mlbid FROM player_id_lookup
        WHERE yahooname = $1 
    `
    try {
        const result = await pool.query(sql, [yahooName]);
        return result?.rows[0]?.mlbid
    } catch (err) {
        console.error("Something went wrong")
        console.error(err);
        throw err;
    }
}

async function getPlayerNamesFromYahooName(yahooNamesArray) {
    const sql = `
        SELECT mlbname, yahooname, lastcommafirst FROM player_id_lookup
        WHERE yahooname = ANY($1::text[]);
    `
    try {
        const results = await pool.query(sql, [yahooNamesArray]);
        return results.rows;
    } catch (err) {
        console.error("Something went wrong")
        console.error(err);
        throw err;
    }
}

module.exports = { getMlbIdFromYahooName, getPlayerNamesFromYahooName, getMlbIdsFromYahooIds, getByYahooId }