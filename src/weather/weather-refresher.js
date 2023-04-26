const cacheManager = require('../cache/cache-manager');

const exampleWeatherInfo = require('../../weatherInfo');
const { getWeatherInfoAtStadiums } = require('./weather-service');


async function refreshWeatherInfoCache() {
    console.log("Refreshing weather cache...")
    // if (process.env.NODE_ENV !== 'production') {
    //     console.log('using example weather data to avoid so many api calls')
    //     cacheManager.setInCache('weather-info', exampleWeatherInfo, 24*60*1000)
    //     return;
    // }

    const weatherResults = await getWeatherInfoAtStadiums();

    cacheManager.setInCache('weather-info', weatherResults, 35 * 60 * 1000);

    console.log("Finished refreshing weather cache...")
}


refreshWeatherInfoCache();
setInterval(refreshWeatherInfoCache, 30 * 60 * 1000);




module.exports = { refreshWeatherInfoCache }