const yahooApi = require('../yahoo-api/fantasy-baseball-api');
const cacheManager = require('../cache/cache-manager');
const { mapFACollection } = require('../mappers/map-yahoo-fa-to-dto');
const {
    combineMatchupsAndFreeAgents,
  } = require('../mappers/combine-fas-with-projected-starters');


const getRosteredPlayerProjections = async (user, leagueId) => {

    try {
        const teamPlayers = await yahooApi.yfbb.getMyPlayers(user, leagueId);
        const mappedTeamPlayers = mapFACollection(teamPlayers);

        const teamStats = cacheManager.getFromCache('team-stats');
        const projectedLineups = cacheManager.getFromCache('projected-lineups');

        const combined = combineMatchupsAndFreeAgents(
            projectedLineups,
            mappedTeamPlayers,
            teamStats
          );

        return combined;
        

    } catch (err) {
        console.error(err)
        throw err;
    }

}

module.exports = { getRosteredPlayerProjections}