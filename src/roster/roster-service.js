const yahooApi = require('../yahoo-api/fantasy-baseball-api');
const cacheManager = require('../cache/cache-manager');
const { mapFACollection } = require('../mappers/map-yahoo-fa-to-dto');
const {
  combineMatchupsAndFreeAgents,
} = require('../mappers/combine-fas-with-projected-starters');


const getRosteredPlayerProjections = async (userId, leagueId, teamId) => {
    const teamPlayers = await yahooApi.yfbb.getMyPlayers(userId, leagueId, teamId);
   
    const mappedTeamPlayers = mapFACollection(teamPlayers);

    const teamStats = cacheManager.getFromCache('team-stats');
    const projectedLineups = cacheManager.getFromCache('projected-lineups');

    const combined = combineMatchupsAndFreeAgents(
      projectedLineups,
      mappedTeamPlayers,
      teamStats
    );

    return combined;
}



const getRosteredPlayers = async (userId, leagueId) => {
    const players = await yahooApi.yfbb.getMyPlayersStats(userId, leagueId);

    const statIds = await yahooApi.yfbb.getStatsIDs(userId);

    for (let i = 0; i < players.length; i++) {
      const playerStats = players[i].player_stats.stats.stat;
      for (let j = 0; j < playerStats.length; j++) {
        const currentStat = playerStats[j];
        const statInfo = getStatInfo(statIds, currentStat.stat_id);
        currentStat.name = statInfo.name;
        currentStat.display_name = statInfo.display_name;
        currentStat.sort_order = statInfo.sort_order;
        currentStat.position_types = statInfo.position_types;
      }
      const playerAdvancedStats = players[i].player_advanced_stats.stats.stat;
      for (let j = 0; j < playerAdvancedStats.length; j++) {
        const currentStat = playerAdvancedStats[j];
        const statInfo = getStatInfo(statIds, currentStat.stat_id);
        currentStat.name = statInfo.name;
        currentStat.display_name = statInfo.display_name;
        currentStat.sort_order = statInfo.sort_order;
        currentStat.position_types = statInfo.position_types;
      }

    }
    return players;
}

const getStatInfo = (statInfo, statId) => {
  const info = statInfo.stat.find(si => si.stat_id === statId);
  if (info) {
    return info;
  } else {
    console.log(`no match for stat id ${statId}`)
    return {}
  }
}

module.exports = { getRosteredPlayerProjections, getRosteredPlayers }