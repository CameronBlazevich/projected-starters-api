function getTeamStats(abbr, teamStats) {
  const replaced = teamStats.map((team) => {
    if (team.teamAbbr === 'AZ') {
      team.teamAbbr = 'ARI';
    }
    if (team.teamAbbr === 'CWS') {
      team.teamAbbr = 'CHW';
    }
    return team;
  });
  const stats = replaced.find((team) => team.teamAbbr === abbr);
  if (stats) {
    return stats;
  }
  console.log(`No stats for ${abbr}`);
  return {};
}

function hydrateMatchupsWithTeamStats(projectedLineups, teamStats) {
  projectedLineups.forEach((dayOfGames) => {
    dayOfGames.games.forEach((game) => {
      if (game.awayTeam) {
        game.awayTeam = getTeamStats(game.awayTeam, teamStats);
        // console.log(`away stats ${JSON.stringify(awayStats)}`)
      }
      if (game.homeTeam) {
        game.homeTeam = getTeamStats(game.homeTeam, teamStats);
      }
    });
  });
}

function addStatsAndShapeResponse(projectedLineups, teamStats) {
  const result = [];
  projectedLineups.forEach((dayOfGames) => {
    dayOfGames.forEach((game) => {
      const gameDate = game.gameDate.split(',')[0]; // extract just the date
      let awayStats = {};
      let homeStats = {};
      if (game.awayTeam) {
        awayStats = getTeamStats(game.awayTeam, teamStats);
        // console.log(`away stats ${JSON.stringify(awayStats)}`)
      }
      if (game.homeTeam) {
        homeStats = getTeamStats(game.homeTeam, teamStats);
      }
      // console.log(`away stats ${JSON.stringify(awayStats)}`)
      // console.log(`home stats ${JSON.stringify(homeStats)}`)
      const gameObj = {
        ...game,
      };

      gameObj.awayTeam = awayStats;
      gameObj.homeTeam = homeStats;
      if (gameObj.awayPitcher || gameObj.homePitcher) {
        // check if gameObj contains at least one non-empty value
        let gameDateObj = result.find((obj) => obj.gameDate === gameDate); // check if gameDate already exists in result array
        if (!gameDateObj) {
          gameDateObj = {
            // if not, create new object with gameDate and empty games array
            gameDate: gameDate,
            games: [],
          };
          result.push(gameDateObj);
        }
        gameDateObj.games.push(gameObj);
      } else {
        // gameObj is empty, but still need to create gameDate object if it doesn't exist
        const gameDateObj = result.find((obj) => obj.gameDate === gameDate);
        if (!gameDateObj) {
          result.push({
            gameDate: gameDate,
            games: [],
          });
        }
      }
    });
  });
  return result;
}

function combineMatchupsAndFreeAgents(
  projectedMatchups,
  freeAgents,
  teamStats
) {
  const combinedData = [];
  for (let i = 0; i < projectedMatchups?.length; i++) {
    const dailyData = [];
    for (const game of projectedMatchups[i].games) {
      // Check if there is a matching free agent for the away pitcher
      const awayPitcherMatch = freeAgents.find(
        (agent) =>
          agent.name.full?.normalize().toLowerCase() ===
          game.awayPitcher?.Name?.normalize().toLowerCase()
      );

      // Check if there is a matching free agent for the home pitcher
      const homePitcherMatch = freeAgents.find(
        (agent) =>
          agent.name.full?.normalize().toLowerCase() ===
          game.homePitcher?.Name?.normalize().toLowerCase()
      );

      if (homePitcherMatch) {
        homePitcherMatch.stats = game.homePitcher.stats;
      }

      if (awayPitcherMatch) {
        awayPitcherMatch.stats = game.awayPitcher.stats;
      }

      // If there is a match for either pitcher, add a new object to the combined data array
      if (awayPitcherMatch || homePitcherMatch) {
        const gameToAdd = {
          gameDate: projectedMatchups[i].date,
          gameId: game.mlb_com_game_id,
          ...game,
          awayPitcher: awayPitcherMatch || null,
          homePitcher: homePitcherMatch || null,
        };
        dailyData.push(gameToAdd);
      } else {
        dailyData.push({ gameDate: projectedMatchups[i].date });
      }
    }
    combinedData.push(dailyData);
  }

  const result = addStatsAndShapeResponse(combinedData, teamStats);
  return result;
}

module.exports = { combineMatchupsAndFreeAgents, hydrateMatchupsWithTeamStats };
