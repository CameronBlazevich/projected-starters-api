const cacheManager = require('../cache/cache-manager');
const logger = require('../logger/logger');
const { combineMatchupsAndFreeAgents } = require('../mappers/combine-fas-with-projected-starters');
const { mapFACollection } = require('../mappers/map-yahoo-fa-to-dto');
const { createSuccessResponse, createErrorResponse } = require('../service-response');
const yahooApi = require('../yahoo-api/fantasy-baseball-api');


const getFreeAgentsWithMatchupInfo = async (userId, leagueId) => {

        const teamStats = cacheManager.getFromCache('team-stats');
        const projectedLineups = cacheManager.getFromCache('projected-lineups');
        const freeAgents = await yahooApi.yfbb.getFreeAgents(userId, leagueId);
        logger.debug(`Free agents returned: ${freeAgents?.length}`)

        const freeAgentsDTO = mapFACollection(freeAgents);

        const combined = combineMatchupsAndFreeAgents(
            projectedLineups,
            freeAgentsDTO,
            teamStats
        );

        return combined;
}


module.exports = { getFreeAgentsWithMatchupInfo }