const cacheManager = require('../cache/cache-manager');
const teamStatsApi = require('./team-stats-api');

async function refreshStatsCache() {
  console.log('Retreiving team stats...');
  const stats = await teamStatsApi.getTeamStats();

  cacheManager.setInCache('team-stats', stats, 18000);
}

refreshStatsCache();

setInterval(refreshStatsCache, 30 * 60 * 1000);

//for testing short interval
// setInterval(refreshStatsCache, 1500);

module.exports = {
  refreshStatsCache,
};
