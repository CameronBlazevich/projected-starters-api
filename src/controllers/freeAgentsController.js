const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');
const {
  combineMatchupsAndFreeAgents,
} = require('../mappers/combine-fas-with-projected-starters');
const { mapFACollection } = require('../mappers/map-yahoo-fa-to-dto');
const yahooApi = require('../yahoo-api/fantasy-baseball-api');

router.get('/:foo/:bar', async (req, res) => {
  const fooValue = req.params.foo;
  const barValue = req.params.bar;
  // check if the cached data is available
  const teamStats = cacheManager.getFromCache('team-stats');
  const projectedLineups = cacheManager.getFromCache('projected-lineups');

  //temp
  yahooApi.yfbb.WEEK = await yahooApi.yfbb.getCurrentWeek();
  console.log(`Getting current week...`);

  const freeAgents = await yahooApi.yfbb.getFreeAgents();

  const freeAgentsDTO = mapFACollection(freeAgents);

  const combined = combineMatchupsAndFreeAgents(
    projectedLineups,
    freeAgentsDTO,
    teamStats
  );

  if (teamStats) {
    // use the cached data to get free agents

    res.send(
      // `Free agents for foo=${fooValue} and bar=${barValue}: FreeAgents: ${JSON.stringify(
      //   freeAgentsDTO
      // )} Team Stats: ${JSON.stringify(
      //   teamStats
      // )} and Projected Lineups: ${JSON.stringify(projectedLineups)}`
      `Free agents that are starting: ${JSON.stringify(
        combined
      )}. Team Stats: ${JSON.stringify(teamStats)}`
    );
  } else {
    res.send('Data not available. Please try again later.');
  }
});

module.exports = router;
