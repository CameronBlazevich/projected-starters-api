const yahooApi = require('../yahoo-api/fantasy-baseball-api');
const cacheManager = require('../cache/cache-manager');
const {
    combineMatchupsAndFreeAgents,
  } = require('../mappers/combine-fas-with-projected-starters');
  const { mapFACollection } = require('../mappers/map-yahoo-fa-to-dto');

const { addWatchlistEntry, getWatchlist } = require('../database/user-watchlist');


const addToWatchlist = async (watchlistArgs) => {
    await addWatchlistEntry(watchlistArgs)
    return watchlistArgs;
}


const getWatchedPlayers = async (user, leagueId) => {

    const watchList = await getWatchlist(user.user_id, leagueId);
    if (!watchList?.length > 0) {
        return [];
    }

    const yahooPlayerIds = watchList.map(entry => `422.p.${entry.player_id}`);
    let isSinglePlayer = false; // yikes
    if (yahooPlayerIds.length === 1) {
        isSinglePlayer = true;
    }
    const playerIdsString = yahooPlayerIds.join(`,`);

    const yahooResponse = await yahooApi.yfbb.getPlayersByIds(user, playerIdsString, leagueId)

    const teamStats = cacheManager.getFromCache('team-stats');
    const projectedLineups = cacheManager.getFromCache('projected-lineups');

    const players = isSinglePlayer ? mapFACollection([yahooResponse]) : mapFACollection(yahooResponse)
    const combined = combineMatchupsAndFreeAgents(projectedLineups, players,teamStats);

    
    return combined;

}

module.exports = { getWatchedPlayers, addToWatchlist}