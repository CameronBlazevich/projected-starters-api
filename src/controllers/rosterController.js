const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const {getRosteredPlayerProjections} = require('../roster/roster-service');




// router.get("/getProjectedStarters/:leagueId", auth, async (req, res) => {
router.get("/getProjectedStarters/:leagueId", auth, async (req, res) => {
    const leagueId = req.params.leagueId;
    if (!leagueId) {
        return res.status(400).json({error: "LeagueId is required."})
    }

    const user = req.user;
    try {
        const result = await getRosteredPlayerProjections(user, leagueId)
        
        return res.status(200).json(result);
    } catch (err) {
        if (err.message?.includes("401")) {
            return res.status(400).json({error: "Yahoo authentication failure"})
        }
        return res.status(500).json({ error: "Something went wrong" })
    }
})

module.exports = router;