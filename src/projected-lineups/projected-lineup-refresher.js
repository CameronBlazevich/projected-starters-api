const cacheManager = require('../cache/cache-manager');
const { hydrateMatchupsWithTeamStats } = require('../mappers/combine-fas-with-projected-starters');
const { getWeatherInfoAtStadiums, addWeatherInfoToProjectedLineups } = require('../weather/weather-service');
const projectedLineupApi = require('./projected-lineup-api');

async function refreshProjectedLineupCache() {
  console.log('Retreiving projected lineups...');
  const lineups = await projectedLineupApi.getLineups();

  cacheManager.setInCache('projected-lineups', lineups, 18000);

  // let's add weather info to the projected-lineups but fail softly
  try {
    const weatherInfo = await getWeatherInfoAtStadiums();
    const combined = addWeatherInfoToProjectedLineups(weatherInfo, lineups);

    console.log(`Overwriting projected-lineups with version that includes weather.`)
    cacheManager.setInCache('projected-lineups', combined, 18000);
    // // let's add team stats to the projected-lineups but fail softly
    // try {
    //   const teamStats = cacheManager.getFromCache('team-stats');
    //   if (teamStats) {
    //     hydrateMatchupsWithTeamStats(combined, teamStats);
    //     console.log(`Overwriting projected-lineups with version that includes weather.`)
    //     cacheManager.setInCache('projected-lineups', combined, 18000);
    //   }
    // } catch (err) {
    //   console.log(`Unable to add team stats to projected lineups.`)
    //   console.error(err)
    // }
  } catch (err) {
    console.log(`Unable to add weather to projected lineups.`)
    console.error(err)
  }



}

refreshProjectedLineupCache();

setInterval(refreshProjectedLineupCache, 30 * 60 * 1000);

module.exports = {
  refreshProjectedLineupCache,
};
