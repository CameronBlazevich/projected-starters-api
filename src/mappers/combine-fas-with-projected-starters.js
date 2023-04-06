function convertPitchers(arr, teamStats) {
  return arr.map((obj) => {
    const games = obj.games.map((game) => {
      const updatedGame = {};
      if (game.awayPitcher !== null) {
        const opposingTeam = teamStats.find(
          (team) => team.teamAbbr === game.homeTeam
        );
        updatedGame.awayPitcher = {
          name: game.awayPitcher,
          opposingTeam: opposingTeam,
        };
      }
      if (game.homePitcher !== null) {
        const opposingTeam = teamStats.find(
          (team) => team.teamAbbr === game.awayTeam
        );
        updatedGame.homePitcher = {
          name: game.homePitcher,
          opposingTeam: opposingTeam,
        };
      }
      return Object.assign({}, game, updatedGame);
    });
    return Object.assign({}, obj, { games });
  });
}

function extractGameDates(arr) {
  const result = [];
  arr.forEach((subArr) => {
    subArr.forEach((game) => {
      const gameDate = game.gameDate.split(',')[0]; // extract just the date
      const gameObj = {
        // create object with just the necessary data
        awayTeam: game.awayTeam,
        homeTeam: game.homeTeam,
        awayPitcher: game.awayPitcher,
        homePitcher: game.homePitcher,
      };
      if (Object.values(gameObj).some((val) => val)) {
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
        gameDateObj.games.push(gameObj); // push gameObj to the games array
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
  // Create a new array to store the combined data
  const combinedData = [];

  // Loop through each game in the projected matchups
  for (let i = 0; i < projectedMatchups.length; i++) {
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

      // If there is a match for either pitcher, add a new object to the combined data array
      if (awayPitcherMatch || homePitcherMatch) {
        dailyData.push({
          gameDate: projectedMatchups[i].date,
          awayTeam: game.awayTeam,
          homeTeam: game.homeTeam,
          awayPitcher: awayPitcherMatch || null,
          homePitcher: homePitcherMatch || null,
        });
      } else {
        dailyData.push({ gameDate: projectedMatchups[i].date });
      }
    }
    combinedData.push(dailyData);
  }
  // Return the combined data array
  const result = convertPitchers(extractGameDates(combinedData), teamStats);
  // replaceOpposingTeams(result, teamStats);
  return result;
}

module.exports = { combineMatchupsAndFreeAgents };
