const axios = require('axios');

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
    console.log(err);
    console.error("Couldn't get team stats");
  }

  return mapped;
};

module.exports = { getTeamStats };
