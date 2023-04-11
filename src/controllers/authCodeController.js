const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { storeAuthCode } = require('../database/auth-code');


router.post("/", auth, async (req, res) => {

    if (!req.body.code) {
        return res.status(400).send("No code in request")
    }
    const user = req.user;
//  console.log(JSON.stringify(user))
    const result = await storeAuthCode(user.user_id, req.body.code)

    res.status(200).send("Auth code saved");
});

module.exports = router;