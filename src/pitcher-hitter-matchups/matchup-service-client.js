const axios = require('axios');

const getMatchups = async (mlbPitcherId, hittingTeamId, pitchingTeamId) => {
    const url = `http://localhost:3001/pitcherMatchups/${hittingTeamId}/${pitchingTeamId}/${mlbPitcherId}`;

    console.log(`Making req to ${url}`)
    const resp = await axios.get(url);
    return resp.data;


}

module.exports = { getMatchups }