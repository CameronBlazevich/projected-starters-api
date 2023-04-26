const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');
const {addWeatherInfoToProjectedLineups} = require('../weather/weather-service')
const {hydrateMatchupsWithTeamStats} = require('../mappers/combine-fas-with-projected-starters')


router.get("/", async (req, res) => {
    try {

        const projectedLineups = cacheManager.getFromCache('projected-lineups');
        const teamStats = cacheManager.getFromCache('team-stats');

        hydrateMatchupsWithTeamStats(projectedLineups, teamStats);

        return res.status(200).json(projectedLineups);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" })
    }
})

module.exports = router;