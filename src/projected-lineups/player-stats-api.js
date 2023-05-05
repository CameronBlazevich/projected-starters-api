const axios = require('axios');
const { logError } = require('../axios/error-logger');

const getPlayerStats = async (playerId) => {
  const url = `https://fantasydata.com/MLB_Player/PlayerSeasonStats`;
  const queryString = `?sort=&page=1&pageSize=50&group=&filter=&playerid=${playerId}&season=2023&scope=1`;
  try {
    const resp = await axios.get(`${url}${queryString}`);
    return resp.data.Data;
  } catch (err) {
    console.log(
      `Something went wrong getting player stats for playerId ${playerId}`
    );
    logError(err)
  }
};

module.exports = { getPlayerStats };