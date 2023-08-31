const { getByMlbIds } = require('../database/player-id-lookup');
const { getTransactions } = require('./mlb-transactions-client');

const yahooApi = require('../yahoo-api/fantasy-baseball-api');
const { get_tomorrows_date } = require('../utilities/dateHelper');

const get_mlb_transactions = async () => {
    const resp = await getTransactions();
    return resp;
}

const get_mlb_transactions_with_free_agent_info = async (userId) => {
    const statusToIgnore = ["signed"];
    const mlb_transactions =  await get_mlb_transactions();
    const filtered_mlb_transactions = mlb_transactions.filter(t => !statusToIgnore.includes(t.status))

    const mlbIds = filtered_mlb_transactions.map(t => t.playerId);

    const player_id_info = await getByMlbIds(mlbIds);


    // ToDo: hard-coded values hardcoded
    const leagueId = '92842'
    // const test = await yahooApi.yfbb.getPlayersInLeagueContext(userId, leagueId, yahooIds);
    const rosteredPlayerYahooIds = await get_league_rosters(userId, leagueId);
    console.log(rosteredPlayerYahooIds.length)
    
    const results = [];
    for (let i=0; i<filtered_mlb_transactions.length; i++) {
        const trans = filtered_mlb_transactions[i];
        const player = player_id_info.find(p => p.mlbid == trans.playerId);
        if (!player) {
            console.log(`no mapping for ${trans.playerId}, ${trans.description}`)
        }
        trans.yahoo_id = player?.yahooid;
        trans.available = player ? !rosteredPlayerYahooIds.includes(player.yahooid.toString()) : 'unknown';
        results.push(trans);
    }

    return results;
}

// apparently I can't filter by player status AND player id, so can't say hey return the FAs within this list of players...
// going to try to get all rostered players and cross check against mlb transactions

const get_league_teams = async (userId, leagueId) => {
    const leagueStandings = await yahooApi.yfbb.getLeagueSeasonStats(userId, leagueId);
    const teams = leagueStandings.standings.teams;
    // console.log(teams)
    return teams.team;
}

const get_league_rosters = async (userId, leagueId) => {
    const teams = await get_league_teams(userId, leagueId);
    
    const rosteredPlayers = [];
    const tomorrow = get_tomorrows_date();
    for(let i=0; i<teams.length;i++) {
        const teamId = teams[i].team_id;
        const roster = await yahooApi.yfbb.getRoster(leagueId, teamId, userId, tomorrow);
        const rosteredPlayerIds = roster.player.map(p => p.player_id);
        rosteredPlayers.push(...rosteredPlayerIds)
    }
    return rosteredPlayers;
}



module.exports = {get_mlb_transactions_with_free_agent_info}