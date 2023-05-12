const yahooApi = require('../yahoo-api/fantasy-baseball-api');
const cacheManager = require('../cache/cache-manager');
const {
    combineMatchupsAndFreeAgents,
  } = require('../mappers/combine-fas-with-projected-starters');
  const { mapFACollection } = require('../mappers/map-yahoo-fa-to-dto');

const { addWatchlistEntry, getWatchlist, removeWatchlistEntry } = require('../database/user-watchlist');
const logger = require('../logger/logger');


const addToWatchlist = async (watchlistArgs) => {
    await addWatchlistEntry(watchlistArgs)
    return watchlistArgs;
}

const removeFromWatchlist = async(watchlistArgs) => {
    const result = await removeWatchlistEntry(watchlistArgs)
    return result;
}

const getWatchedPlayerKeys = async (user, leagueId) => {
    const watchList = await getWatchlist(user.user_id, leagueId);
    if (!watchList?.length > 0) {
        return [];
    }

    const watchlistKeys = watchList.map(entry => ({playerId: entry.player_id, gameId: entry.game_id}));
   
    return watchlistKeys;
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

    const yahooResponse = await yahooApi.yfbb.getPlayersByIds(user.user_id, playerIdsString, leagueId)

    const teamStats = cacheManager.getFromCache('team-stats');
    const projectedLineups = cacheManager.getFromCache('projected-lineups');

    const players = isSinglePlayer ? mapFACollection([yahooResponse]) : mapFACollection(yahooResponse)
    const gameData = combineMatchupsAndFreeAgents(projectedLineups, players,teamStats);

    const watchListGameIds = watchList.map(wl => wl.game_id);

    const filteredGameData = filterGamesByGameID(gameData, watchListGameIds);
    
    return filteredGameData;
}

const filterGamesByGameID = (gameData, gameIDs) => {
    // chatGPT generated
    // create a new array to hold the filtered results
    const filteredGames = [];
  
    // iterate over each object in the game data array
    for (let i = 0; i < gameData.length; i++) {
      const gameDate = gameData[i].gameDate;
      const games = gameData[i].games;
  
      // create a new array to hold the filtered games for this game date
      const filteredGamesForDate = [];
  
      // iterate over each game object in the games array
      for (let j = 0; j < games.length; j++) {
        const game = games[j];
  
        // check if the game ID is included in the gameIDs array
        if (gameIDs.includes(game.gameId)) {
          filteredGamesForDate.push(game);
        }
      }
  
      // add the filtered games for this date to the overall filteredGames array
      if (filteredGamesForDate.length > 0) {
        filteredGames.push({ gameDate: gameDate, games: filteredGamesForDate });
      }
    }
  
    return filteredGames;
  }
  

module.exports = { getWatchedPlayers, getWatchedPlayerKeys, addToWatchlist, removeFromWatchlist}