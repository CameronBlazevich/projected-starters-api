const cacheManager = require('../cache/cache-manager');
const { getStadiumLocations } = require('../stadiums/stadium-locations');
const { getWeatherForecast } = require('./weather-api');
const exampleWeatherInfo = require('../../weatherInfo')


async function refreshWeatherInfoCache() {
    console.log("Refreshing weather cache...")
    if (process.env.NODE_ENV !== 'production') {
        console.log('using example weather data to avoid so many api calls')
        cacheManager.setInCache('weather-info', exampleWeatherInfo, 24*60*1000)
        return;
    }
    const stadiumLocations = getStadiumLocations();

    const weatherResults = [];

    for (let i = 0; i < stadiumLocations.length; i++) {
        const stadiumForecast = await getWeatherForecast(stadiumLocations[i].lattitude, stadiumLocations[i].longitude);

        // map result to only useful info
        const mapped = mapStadiumForecast(stadiumForecast, stadiumLocations[i]);
        weatherResults.push(mapped);
    }

    cacheManager.setInCache('weather-info', weatherResults, 35 * 60 * 1000);
    storeData(JSON.stringify(weatherResults), './weatherInfo.json')
    console.log("Finished refreshing weather cache...")
}


refreshWeatherInfoCache();
setInterval(refreshWeatherInfoCache, 30 * 60 * 1000);


const mapStadiumForecast = (weatherForecast, stadiumLocation) => {

    //ToDo: throw away a bunch of data in the middle of the night

    const mapped = {
        teamAbbr: stadiumLocation.teamAbbr,
        parkName: stadiumLocation.park,
        lattitude: stadiumLocation.lattitude,
        longitude: stadiumLocation.longitude,
        location: weatherForecast.location

    };

    const forecastDays = mapForecastDays(weatherForecast.forecast.forecastday);

    mapped.forecast = {
        days: forecastDays
    }

    return mapped;
}

const mapForecastDays = (forecastDays) => {
    
    let mappedDays = [];
    for (let i = 0; i < forecastDays.length; i++) {
        const day = forecastDays[i];
        const mapped = {
            date: day.date,
            high: day.maxtemp_f,
            low: day.mintemp_f
        };

        const hourlyForecast = mapHourlyForecast(day.hour);
        mapped.hourlyForecast = hourlyForecast;

        mappedDays.push(mapped);
    }
    return mappedDays;
}

const mapHourlyForecast = (hourlyInfo) => {
    const dayHours = [];
    for (let i = 0; i < hourlyInfo.length; i++) {
        const hour = hourlyInfo[i];

        const mappedHour = {
            time_epoch: hour.time_epoch,
            //ToDo: figure out what tz this time is
            time_local: hour.time,
            temp_f: hour.temp_f,
            wind: {
                speed_mph: hour.wind_mph,
                direction: hour.wind_dir,
                degree: hour.wind_degree,
                gust_mph: hour.gust_mph
            },
            humidity: hour.humidity,
            feels_like_f: hour.feelslike_f,
            chance_of_rain: hour.chance_of_rain,
            chance_of_snow: hour.chance_of_snow,
            condition: {
                description: hour.condition.text,
                icon: hour.condition.icon
            }
        }

        dayHours.push(mappedHour);
    }

    return dayHours;
}

module.exports = { refreshWeatherInfoCache }