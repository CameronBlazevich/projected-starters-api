const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');
const yahooApi = require('../yahoo-api/fantasy-baseball-api');

router.get('/:foo/:bar', async (req, res) => {
  const fooValue = req.params.foo;
  const barValue = req.params.bar;
  // check if the cached data is available
  const teamStats = cacheManager.getFromCache('team-stats');
  const projectedLineups = cacheManager.getFromCache('projected-lineups');

  // If crededentials exist
  let freeAgents = [];

  yahooApi.yfbb.WEEK = await yahooApi.yfbb.getCurrentWeek();
  console.log(`Getting current week...`);

  freeAgents = await yahooApi.yfbb.getFreeAgents();

  if (teamStats) {
    // use the cached data to get free agents

    res.send(
      `Free agents for foo=${fooValue} and bar=${barValue}: FreeAgents: ${JSON.stringify(
        freeAgents
      )} Team Stats: ${JSON.stringify(
        teamStats
      )} and Projected Lineups: ${JSON.stringify(projectedLineups)}`
    );
  } else {
    res.send('Data not available. Please try again later.');
  }
});

module.exports = router;
