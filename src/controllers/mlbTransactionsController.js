const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { get_mlb_transactions_with_free_agent_info } = require('../mlb-transactions/mlb-transaction-service');



router.get("/", auth, async (req, res) => {
    try {
        const user = req.user;
        const result = await get_mlb_transactions_with_free_agent_info(user.user_id);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" })
    }
})

module.exports = router;