const axios = require('axios');
const { logError } = require('../axios/error-logger');

const weatherUrl = 'http://api.weatherapi.com/v1/forecast.json?';
const key = process.env.WEATHER_API_KEY;

const getWeatherForecast = async (lat, lon) => {
    const daysAhead = 3;
    const reqUrl = `${weatherUrl}key=${key}&q=${lat},${lon}&days=${daysAhead}`
    try {
        const response = await axios.get(reqUrl);
        return response.data;
    } catch (err) {
        logError(err)
    }
}

module.exports = { getWeatherForecast }
