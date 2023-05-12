const axios = require('axios');
const { logError } = require('../axios/error-logger');
const logger = require('../logger/logger');

const getPlayerStats = async (playerId) => {
  const url = `https://fantasydata.com/MLB_Player/PlayerSeasonStats`;
  const queryString = `?&filter=&playerid=${playerId}&season=2023&scope=1`;
  try {
    const resp = await axios.get(`${url}${queryString}`);
    return resp.data.Data;
  } catch (err) {
    logger.info(`Something went wrong getting player stats for playerId ${playerId} at url: ${url}${queryString}`)
    logError(err)
  }
};

module.exports = { getPlayerStats };