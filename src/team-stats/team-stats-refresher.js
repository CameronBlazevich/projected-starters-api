const cacheManager = require('../cache/cache-manager');
const { TeamIds } = require('../enums');
const { enhance } = require('./stat-enhancer');
const teamStatsApi = require('./team-stats-api');

async function refreshStatsCache() {
  console.log('Retreiving team stats...');
  const stats = await teamStatsApi.getTeamStats();

  const teamRecordsByDivision = await teamStatsApi.getTeamStandings();
  const flattenedTeamRecords = extractTeamRecords(teamRecordsByDivision);

  const enhancedStats = enhance(stats);

  enhancedStats.forEach(team => {
    const teamRecord = getTeamRecord(team.teamAbbr, flattenedTeamRecords);
    team.wins = teamRecord.wins;
    team.losses = teamRecord.losses;
  })

  cacheManager.setInCache('team-stats', enhancedStats, 18000);
}

refreshStatsCache();

setInterval(refreshStatsCache, 30 * 60 * 1000);

//for testing short interval
// setInterval(refreshStatsCache, 1500);

const getTeamRecord = (teamAbbr, teamRecords) => {
  const teamId = TeamIds[teamAbbr];
  if (!teamId) {
    console.log(`No teamId found for ${teamAbbr}`)
  }

  const teamRecord = teamRecords.find(tr => tr.team.id === teamId);
  return teamRecord;

}

const extractTeamRecords = (recordsByDivision) => {
  let result = [];
  recordsByDivision.forEach(division => {
    result.push(...division.teamRecords)
  })
  return result;
}

module.exports = {
  refreshStatsCache,
};
