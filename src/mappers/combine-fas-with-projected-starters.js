// function convertPitchers(arr, teamStats) {
//   return arr.map((obj) => {
//     const games = obj.games.map((game) => {
//       const updatedGame = {};
//       if (game.awayPitcher) {
//         const opposingTeam = teamStats.find(
//           (team) => team.teamAbbr === game.homeTeam
//         );
//         updatedGame.awayPitcher = {
//           name: game.awayPitcher.name,
//           opposingTeam: opposingTeam,
//         };
//       }
//       if (game.homePitcher) {
//         const opposingTeam = teamStats.find(
//           (team) => team.teamAbbr === game.awayTeam
//         );
//         updatedGame.homePitcher = {
//           name: game.homePitcher.name,
//           opposingTeam: opposingTeam,
//         };
//       }
//       return Object.assign({}, game, updatedGame);
//     });
//     return Object.assign({}, obj, { games });
//   });
// }

function getTeamStats(abbr, teamStats) {
  const replaced = teamStats.map(team => {
    if (team.teamAbbr === "AZ") {
      team.teamAbbr = "ARI"
    }
    if (team.teamAbbr === "CWS") {
      team.teamAbbr = "CHW"
    }
    return team;
  })
  const stats = replaced.find((team) => team.teamAbbr === abbr);
  if (stats) {
    return stats;
  }
  console.log(`No stats for ${abbr}`);
  return {};
}

function extractGameDates(arr, teamStats) {
  const result = [];
  arr.forEach((subArr) => {
    subArr.forEach((game) => {
      const gameDate = game.gameDate.split(',')[0]; // extract just the date
      let awayStats = {};
      let homeStats = {};
      if (game.awayTeam) {
        awayStats = getTeamStats(game.awayTeam, teamStats);
      }
      if (game.homeTeam) {
        homeStats = getTeamStats(game.homeTeam, teamStats);
      }
      const gameObj = {
        // create object with just the necessary data
        awayTeam: awayStats,
        homeTeam: homeStats,
        awayPitcher: game.awayPitcher,
        homePitcher: game.homePitcher,
      };
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
  // Create a new array to store the combined data
  const combinedData = [];

  // console.log(`Returned ${projectedMatchups?.length}`)
  // Loop through each game in the projected matchups
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
        // homePitcherMatch.mlbComPlayerId = game.homePitcher.PlayerID; // I thought this would be the id needed to get the same
        // images from mlb.com/probable-pitchers but it's not
      }

      if (awayPitcherMatch) {
        awayPitcherMatch.stats = game.awayPitcher.stats;
        // awayPitcherMatch.mlbComPlayerId = game.awayPitcher.PlayerID;
      }

      // If there is a match for either pitcher, add a new object to the combined data array
      if (awayPitcherMatch || homePitcherMatch) {
        const pitcher = {
          gameDate: projectedMatchups[i].date,
          awayTeam: game.awayTeam,
          homeTeam: game.homeTeam,
          awayPitcher: awayPitcherMatch || null,
          homePitcher: homePitcherMatch || null,
        }
        dailyData.push(pitcher);
      } else {
        dailyData.push({ gameDate: projectedMatchups[i].date });
      }
    }
    combinedData.push(dailyData);
  }
  // Return the combined data array
  const result = //convertPitchers(
    extractGameDates(combinedData, teamStats);
  //  teamStats
  //);
  // replaceOpposingTeams(result, teamStats);
  return result;
}

module.exports = { combineMatchupsAndFreeAgents };
