const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');


router.get("/", async (req, res) => {
    try {
        const teamStats = cacheManager.getFromCache('team-stats');
        return res.status(200).json(teamStats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" })
    }
})

module.exports = router;