const cacheManager = require('../cache/cache-manager');

const exampleWeatherInfo = require('../../weatherInfo');
const { getWeatherInfoAtStadiums } = require('./weather-service');

async function refreshWeatherInfoCache() {
    console.log("Refreshing weather cache...")

    const weatherResults = await getWeatherInfoAtStadiums();

    cacheManager.setInCache('weather-info', weatherResults, 35 * 60 * 1000);

    console.log("Finished refreshing weather cache...")
}

refreshWeatherInfoCache();
setInterval(refreshWeatherInfoCache, 30 * 60 * 1000);

module.exports = { refreshWeatherInfoCache }