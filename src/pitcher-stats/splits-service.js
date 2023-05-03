const axios = require('axios');
const { getByYahooId } = require('../database/player-id-lookup');
const { getPitcherSplits } = require('./fangraphs-api');

const getSplits = async (yahooPlayerId) => {

    const playerIds = await getByYahooId(yahooPlayerId);
    const fangraphsPlayerId = playerIds.idfangraphs;
    const fangraphsSplits = await getPitcherSplits(fangraphsPlayerId);

    return fangraphsSplits;
}


module.exports = {getSplits};