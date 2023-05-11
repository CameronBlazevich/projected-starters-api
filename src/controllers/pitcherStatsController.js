const express = require('express');
const router = express.Router();
const { getGameLog } = require('../pitcher-stats/game-log-service');
const { getSplits } = require('../pitcher-stats/splits-service');
const { getStats } = require('../pitcher-stats/season-stats-service');
const { createErrorResponse } = require('./responses/error-response')



router.get("/gameLog/:pitcherId", async (req, res) => {
    try {
        const gameLog = await getGameLog(req.params.pitcherId);
        return res.status(200).json(gameLog);
    } catch (err) {
        createErrorResponse(res, err);
    }
})

router.get("/splits/:yahooPlayerId", async (req, res) => {
    try {
        const splits = await getSplits(req.params.yahooPlayerId);
        return res.status(200).json(splits);
    } catch (err) {
        createErrorResponse(res, err);
    }
})

router.get("/seasons/:yahooPlayerId", async (req, res) => {
    try {
        const seasons = await getStats(req.params.yahooPlayerId);
        return res.status(200).json(seasons);
    } catch (err) {
        createErrorResponse(res, err);
    }
})

module.exports = router;