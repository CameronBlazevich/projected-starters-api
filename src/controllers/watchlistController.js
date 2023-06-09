const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { getWatchedPlayers, getWatchedPlayerKeys, addToWatchlist, removeFromWatchlist } = require('../watchlist/watchlist-service')
const { PlayerIdTypes } = require('../enums');
const { createErrorResponse } = require('./responses/error-response');



router.get("/:leagueId", auth, async (req, res) => {
    const user = req.user;
    try {
        const result = await getWatchedPlayers(user, req.params.leagueId);
        return res.status(200).json(result);
    } catch (err) {
        return createErrorResponse(ers, err);
    }
})

router.get("/getPlayerIds/:leagueId", auth, async (req, res) => {
    const user = req.user;
    try {
        const result = await getWatchedPlayerKeys(user, req.params.leagueId);
        return res.status(200).json(result);
    } catch (err) {
        return createErrorResponse(res, err);
    }
})

router.post("/addToWatchlist", auth, async (req, res) => {

    if (!req.body.leagueId) {
        return res.status(400).send("No leagueId in request")
    }

    if (!req.body.gameId) {
        return res.status(400).send("No gameId in request")
    }

    if (!req.body.playerId) {
        return res.status(400).send("No playerId in request")
    }

    const { leagueId, gameId, playerId } = req.body;


    const user = req.user;

    const gameTime = new Date()
    const watchlistArgs = { userId: user.user_id, playerId, playerIdTypeId: PlayerIdTypes.YahooPlayerId, leagueId, gameId, gameTime }

    try {
        const result = await addToWatchlist(watchlistArgs)
        return res.status(200).json(result);
    } catch (err) {
        createErrorResponse(err);
    }
});

router.post("/removeFromWatchlist", auth, async (req, res) => {

    if (!req.body.leagueId) {
        return res.status(400).send("No leagueId in request")
    }

    // ToDo: For now we're ignoring gameId
    // if (!req.body.gameId) {
    //     return res.status(400).send("No gameId in request")
    // }

    if (!req.body.playerId) {
        return res.status(400).send("No playerId in request")
    }

    const { leagueId, gameId, playerId } = req.body;

    const user = req.user;

    const watchlistArgs = { userId: user.user_id, playerId, leagueId, gameId }

    try {
        const result = await removeFromWatchlist(watchlistArgs)
        return res.status(200).json(result);
    } catch (err) {
        return createErrorResponse(res, err);
    }
});

module.exports = router;