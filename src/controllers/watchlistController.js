const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const {getWatchedPlayers, getWatchedPlayerIds, addToWatchlist, removeFromWatchlist} = require('../watchlist/watchlist-service')
const { PlayerIdTypes } = require('../enums');



router.get("/:leagueId", auth, async (req, res) => {
   const user = req.user;
    try {
        const result = await getWatchedPlayers(user, req.params.leagueId);
        console.log(result)
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" })
    }
})

router.get("/getPlayerIds/:leagueId", auth, async (req, res) => {
    const user = req.user;
     try {
         const result = await getWatchedPlayerIds(user, req.params.leagueId);
         return res.status(200).json(result);
     } catch (err) {
         console.error(err);
         return res.status(500).json({ error: "Something went wrong" })
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

    const {leagueId, gameId, playerId} = req.body;


    const user = req.user;

    const gameTime = new Date()
    const watchlistArgs = {userId: user.user_id, playerId, playerIdTypeId: PlayerIdTypes.YahooPlayerId, leagueId, gameId, gameTime}

    const result = await addToWatchlist(watchlistArgs)
    

    return res.status(200).json(result);
});

router.get("/getPlayerIds/:leagueId", auth, async (req, res) => {
    const user = req.user;
     try {
         const result = await getWatchedPlayerIds(user, req.params.leagueId);
         return res.status(200).json(result);
     } catch (err) {
         console.error(err);
         return res.status(500).json({ error: "Something went wrong" })
     }
 })

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

    const {leagueId, gameId, playerId} = req.body;


    const user = req.user;

    const gameTime = new Date()
    const watchlistArgs = {userId: user.user_id, playerId, leagueId, gameId}

    const result = await removeFromWatchlist(watchlistArgs)
    
    return res.status(200).json(result);
});

module.exports = router;