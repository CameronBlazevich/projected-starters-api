const axios = require('axios');

const getMatchups = async (mlbPitcherId, hittingTeamId, pitchingTeamId) => {
    
    const url = process.env.RETROSHEET_SERVICE_URL;
    const urlParams = `pitcherMatchups/${hittingTeamId}/${pitchingTeamId}/${mlbPitcherId}`

    const resp = await axios.get(`${url}${urlParams}`);
    return resp.data;


}

module.exports = { getMatchups }