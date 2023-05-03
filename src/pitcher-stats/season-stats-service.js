const axios = require('axios');
const { getByYahooId } = require('../database/player-id-lookup');
const { getSeasonStats } = require('./fangraphs-api');

const getStats = async (yahooPlayerId) => {

    const playerIds = await getByYahooId(yahooPlayerId);
    const fangraphsPlayerId = playerIds.idfangraphs;

    const fangraphsSplits = await getSeasonStats(fangraphsPlayerId);

    return fangraphsSplits;
}


module.exports = {getStats};