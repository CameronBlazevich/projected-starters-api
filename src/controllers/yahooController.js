const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { storeAuthCode } = require('../database/user-yahoo-info');



router.post("/setCode", auth, async (req, res) => {

    if (!req.body.code) {
        return res.status(400).send("No code in request")
    }
    const user = req.user;
    const result = await storeAuthCode(user.user_id, req.body.code)

    return res.status(200).send("Auth code saved");
});

module.exports = router;