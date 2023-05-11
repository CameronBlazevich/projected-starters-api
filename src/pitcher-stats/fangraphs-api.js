const axios = require('axios');
const { logError } = require('../axios/error-logger');
const ApiServiceUnavailableError = require('../errors/api-service-unavaible');
const httpStatusCodes = require('../errors/http-status-codes');


const getPitcherSplits = async playerId => {
    const url = `https://www.fangraphs.com/api/players/splits?playerid=${playerId}&position=P&season=0&split=&`;
    try {
    const response = await axios.get(url);
    return response.data;
    } catch (err) {
        logError(err);
        throw new ApiServiceUnavailableError(err.message, httpStatusCodes.SERVICE_UNAVAILABLE)
    }
}

const getSeasonStats = async playerId => {
    const url = `https://www.fangraphs.com/api/players/stats?playerid=${playerId}&position=P`;
    try {
    const response = await axios.get(url);
    return response.data;
    } catch (err) {
        logError(err);
        throw new ApiServiceUnavailableError(err.message, httpStatusCodes.SERVICE_UNAVAILABLE)
    }
}

module.exports = { getPitcherSplits, getSeasonStats }