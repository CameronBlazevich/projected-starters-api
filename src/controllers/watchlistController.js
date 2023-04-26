const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const {getWatchedPlayers} = require('../watchlist/watchlist-service')



router.get("/:leagueId", auth, async (req, res) => {
   const user = req.user;
    try {
        const result = await getWatchedPlayers(user, req.params.leagueId);
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


    const user = req.user;

    

    return res.status(200).json({});
});

module.exports = router;