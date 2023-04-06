const axios = require('axios');
const dateHelper = require('../utilities/dateHelper');

const formatResponse = (resp) => {
  const mapGame = (game) => ({
    awayTeam: game.AwayTeam,
    homeTeam: game.HomeTeam,
    awayPitcher: game.AwayTeamProbablePitcherDetails,
    homePitcher: game.HomeTeamProbablePitcherDetails,
  });
  const games = resp.map(mapGame);

  const formatted = {
    date: resp[0].DateString,
    games,
  };

  return formatted;
};

const getLineups = async () => {
  const totalDatesToGet = 4;
  const dates = dateHelper.getTodayAndXMore(totalDatesToGet);

  let requestPromises = [];
  dates.forEach((date) => {
    const filter = {
      filters: {
        scope: null,
        subscope: null,
        splittype: null,
        season: null,
        seasontype: null,
        team: null,
        league: null,
        stattype: null,
        position: null,
        playerid: [],
        searchtext: null,
        scoringsystem: null,
        exportType: null,
        date: date,
        desktop: null,
        dfsoperator: null,
        dfsslateid: null,
        dfsslategameid: null,
        dfsrosterslot: null,
        showfavs: null,
        oddsstate: null,
        teamkey: null,
        showall: null,
      },
    };

    requestPromises.push(makeAPIRequest(filter));
  });

  const completedRequestPromises = await Promise.all(requestPromises);

  const result = completedRequestPromises;
  return result;
};

async function makeAPIRequest(filter) {
  console.log(`Getting projected lineups for ${filter.filters.date}...`);
  let resp;
  try {
    resp = await axios({
      url: 'https://fantasydata.com/MLB_Lineups/RefreshLineups',
      method: 'post',
      data: filter,
    });

    const jsonData = resp.data;

    const formatted = formatResponse(jsonData);
    return formatted;
  } catch (err) {
    console.error(`Some shit hit the fan getting projected lineups: ${err}`);
  }
}

module.exports = { getLineups };
