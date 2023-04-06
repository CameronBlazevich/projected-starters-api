const cacheManager = require('../cache/cache-manager');
const projectedLineupApi = require('./projected-lineup-api');

async function refreshProjectedLineupCache() {
  console.log('Retreiving projected lineups...');
  const lineups = await projectedLineupApi.getLineups();

  cacheManager.setInCache('projected-lineups', lineups, 18000);
}

refreshProjectedLineupCache();

setInterval(refreshProjectedLineupCache, 30 * 60 * 1000);

module.exports = {
  refreshProjectedLineupCache,
};
