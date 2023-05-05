const axios = require('axios');
const { logError } = require('../axios/error-logger');

const statsUrl =
  'https://bdfed.stitch.mlbinfra.com/bdfed/stats/team?stitch_env=prod&sportId=1&gameType=R&group=hitting&order=desc&sortStat=runs&stats=season&season=2023&limit=30&offset=0';

const mapTeam = (team) => {
  const mapped = {
    teamAbbr: team.teamAbbrev,
    runsScored: team.runs,
    strikeouts: team.strikeOuts,
    onBasePercent: team.obp,
  };
  return mapped;
};

const mapResponse = (response) => {
  // console.log(response);
  const mapped = response.data.stats.map((team) => mapTeam(team));
  return mapped;
};

const getTeamStats = async () => {
  console.log('Getting team hitting data');

  let mapped;
  try {
    const resp = await axios({
      url: statsUrl,
      method: 'get',
    });

    mapped = mapResponse(resp);
  } catch (err) {
    logError(err)
  }

  return mapped;
};

const getTeamStandings = async () => {
  console.log(`Getting team standings...`)
  try {
    const reqUrl = `https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2023&standingsTypes=regularSeason`;
    const resp = await axios.get(reqUrl);
    if (resp?.data?.records) {
      return resp.data.records;
    }
  } catch (err) {
    logError(err)
  }
}

module.exports = { getTeamStats, getTeamStandings };
