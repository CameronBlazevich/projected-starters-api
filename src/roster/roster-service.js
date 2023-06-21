const yahooApi = require('../yahoo-api/fantasy-baseball-api');
const cacheManager = require('../cache/cache-manager');
const { mapFACollection } = require('../mappers/map-yahoo-fa-to-dto');
const {
  combineMatchupsAndFreeAgents,
} = require('../mappers/combine-fas-with-projected-starters');
const logger = require('../logger/logger');
const { createAddDropEntry, removeAddDropEntry, getAddDropSchedule } = require('../database/add-drop-schedule');
const { getByYahooIds } = require('../database/player-id-lookup');


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

const getRosteredPlayers = async (userId, leagueId, teamId) => {
    const players = await yahooApi.yfbb.getMyPlayers(userId, leagueId, teamId);
    return players;
}

const getRosteredPlayersWithStats = async (userId, leagueId, teamId) => {
    const players = await yahooApi.yfbb.getMyPlayersStats(userId, leagueId, teamId);

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
    // console.log(`no match for stat id ${statId}`)
    return {}
  }
}

const getScheduledAddDrops = async (userId, leagueId, teamId) => {
  const schedule = await getAddDropSchedule(userId, leagueId, teamId);
  const result = await populatePlayerNamesOnSchedule(schedule);
  return result;
}

const scheduleAddDrop = async (args) => {
  logger.debug(`Adding Player ${args.addPlayerId}. Dropping player ${args.dropPlayerId}. LeagueId: ${args.leagueId}. TeamId: ${args.teamId}. EarliestAddTime: ${args.earliestAddTimeUtc}`)
  const schedule = await createAddDropEntry(args);
  const result = await populatePlayerNamesOnSchedule(schedule);
  return result;
}

const removeScheduledAddDrop = async (args) => {
  logger.debug(`Removing add/drop record Player ${args.addPlayerId}. Dropping player ${args.dropPlayerId}. LeagueId: ${args.leagueId}. TeamId: ${args.teamId}.`)
  const schedule = await removeAddDropEntry(args);
  const result = await populatePlayerNamesOnSchedule(schedule);
  return result;
}

const populatePlayerNamesOnSchedule = async (schedule) => {
  const playerIds = schedule.reduce((result, schedRecord) => {
    result.push(schedRecord.add_player_id, schedRecord.drop_player_id);
    return result;
  }, []);

  const players = await getByYahooIds(playerIds);

  const result = [];
  for (let i=0; i < schedule.length; i++) {
    const record = schedule[i];
    record.addPlayerName = players.find(p => p.yahooid == record.add_player_id)?.yahooname;
    record.dropPlayerName = players.find(p => p.yahooid == record.drop_player_id)?.yahooname;
    result.push(record)
  }

  return result;
  
}

const getIdsForRosteredPlayers = async (userId, leagueId, teamId) => {
  const rosteredPlayers = [];
  try {
    const myPlayers = await getRosteredPlayers(userId, leagueId, teamId);
    const playerIds = myPlayers.map(p => p.player_id);

    const playerInfo = await getByYahooIds(playerIds);
    const mapped = playerInfo.map(pi => {
        const mapped = {name: pi.mlbname, yahoo_id: pi.yahooid, mlbid: pi.mlbid};
        return mapped;
    })
    rosteredPlayers.push(...mapped)
    return rosteredPlayers;
} catch (error) {
    console.error(error)
}
}

module.exports = { getRosteredPlayerProjections, getRosteredPlayersWithStats, scheduleAddDrop, removeScheduledAddDrop, getScheduledAddDrops, getRosteredPlayers, getIdsForRosteredPlayers }