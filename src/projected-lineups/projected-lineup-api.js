const axios = require('axios');
const dateHelper = require('../utilities/dateHelper');
const { getPlayerStats } = require('./player-stats-api');
const fs = require("fs");
const { logError } = require('../axios/error-logger');
const logger = require('../logger/logger');

const formatResponse = (resp) => {
  const mapGame = (game) => {
    const battingOrder = getBattingLineups(game);
    const mapped = {
      mlb_com_game_id: game.GameID,
      awayTeam: game.AwayTeam,
      homeTeam: game.HomeTeam,
      awayPitcher: game.AwayTeamProbablePitcherDetails,
      homePitcher: game.HomeTeamProbablePitcherDetails,
      awayBattingOrder: battingOrder.awayTeamBattingOrder,
      homeBattingOrder: battingOrder.homeTeamBattingOrder,
      date: game.DateString,
      dateTime: game.DateTime,
      gameTime: {
        time: game.GameTime,
        tz: "America/New_York" // haven't spent too much time double checking this
      },
    };
    return mapped;
  }
  const games = resp.map(mapGame);

  const formatted = {
    date: resp[0].DateString,
    games,
  };

  return formatted;
};

const getBattingLineups = (game) => {
  const homeTeamHitters = game.PlayerGameProjections.filter(pgp => pgp.Team === game.HomeTeam);
  const awayTeamHitters = game.PlayerGameProjections.filter(pgp => pgp.Team === game.AwayTeam);

  const homeTeamBattingOrder = homeTeamHitters.sort((a, b) => a.BattingOrder - b.BattingOrder);
  const awayTeamBattingOrder = awayTeamHitters.sort((a, b) => a.BattingOrder - b.BattingOrder);

  return { homeTeamBattingOrder, awayTeamBattingOrder }

}

const getLineups = async () => {
  const totalDatesToGet = process.env.NODE_ENV === 'production' ? 7 : 2;
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

  for (let j = 0; j < completedRequestPromises.length; j++) {
    const dayOfGames = completedRequestPromises[j];
    console.log(`Getting pitcher stats for ${dayOfGames.date}`)

    try {
      // Sometimes these requests time out, but I don't want to kill the whole process when this happens
      // Instead, some pitchers won't have their stats
      for (let i = 0; i < dayOfGames.games.length; i++) {
        const game = dayOfGames.games[i];

        const awayPitcherId = game.awayPitcher?.PlayerID;
        const homePitcherId = game.homePitcher?.PlayerID;

        if (awayPitcherId) {
          const awayPitcherStats = await getPlayerStats(awayPitcherId);
          game.awayPitcher.stats = mapStats(awayPitcherStats);
        }

        if (homePitcherId) {
          const homePitcherStats = await getPlayerStats(homePitcherId);
          game.homePitcher.stats = mapStats(homePitcherStats);
        }
      }
    } catch (err) {
      logger.info(`An error occured getting stats. Swallowing and continuing`)
      logger.error(err)
      continue;
    }
  }

  return completedRequestPromises;
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
    logError(err)
  }
}

const mapStats = (fullStats) => {
  const season = 2023;
  const thisSeason = fullStats?.find((s) => s.Season === season);
  
  if (thisSeason) {
    mapped = {
      innings_pitched: thisSeason.InningsPitched,
      era: thisSeason.EarnedRunAverage,
      strikeouts: thisSeason.PitchingStrikeouts,
      whip: thisSeason.WalksHitsPerInningsPitched,
      wins: thisSeason.Wins,
      losses: thisSeason.Losses,
      games_started: thisSeason.Started,
      games: thisSeason.Games
    };

    return mapped;
  }
  return {};
};

module.exports = { getLineups };
