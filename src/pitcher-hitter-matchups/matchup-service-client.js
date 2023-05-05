const axios = require('axios');
const { logError } = require('../axios/error-logger');

const getMatchups = async (mlbPitcherId, hittingTeamId, pitchingTeamId) => {
    
    const url = process.env.RETROSHEET_SERVICE_URL;
    const urlParams = `pitcherMatchups/${hittingTeamId}/${pitchingTeamId}/${mlbPitcherId}`

    try {
    const resp = await axios.get(`${url}${urlParams}`);
    return resp.data;
    } catch (err) {
        logError(err);
    }


}

module.exports = { getMatchups }