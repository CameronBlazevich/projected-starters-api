const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');
const { createErrorResponse } = require('./responses/error-response')


router.get("/", async (req, res) => {
    try {
        const teamStats = cacheManager.getFromCache('team-stats');
        return res.status(200).json(teamStats);
    } catch (err) {
        return createErrorResponse(res, err);
    }
})

module.exports = router;