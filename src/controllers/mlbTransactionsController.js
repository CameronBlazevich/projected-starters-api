const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');
const { get_mlb_transactions_with_free_agent_info } = require('../mlb-transactions/mlb-transaction-service');



router.get("/", async (req, res) => {
    try {
        const result = await get_mlb_transactions_with_free_agent_info();
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" })
    }
})

module.exports = router;