const axios = require('axios');


const getPitcherSplits = async playerId => {
    const url = `https://www.fangraphs.com/api/players/splits?playerid=${playerId}&position=P&season=0&split=&`;
    try {
    const response = await axios.get(url);
    return response.data;
    } catch (err) {
        console.error(err);
    }
}

const getSeasonStats = async playerId => {
    const url = `https://www.fangraphs.com/api/players/stats?playerid=${playerId}&position=P`;
    console.log(url)
    try {
    const response = await axios.get(url);
    return response.data;
    } catch (err) {
        console.error(err);
    }
}

module.exports = { getPitcherSplits, getSeasonStats }