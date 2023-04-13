const express = require('express');
const router = express.Router();
const auth = require('../request-handling/middleware');
const { storeAuthCode, getInfo } = require('../database/user-yahoo-info');


router.post("/setCode", auth, async (req, res) => {

    if (!req.body.code) {
        return res.status(400).send("No code in request")
    }
    const user = req.user;
    const result = await storeAuthCode(user.user_id, req.body.code)

    return res.status(200).send("Auth code saved");
});

router.get("/getYahooInfo", auth, async(req, res) => {
    const user = req.user;
    try {
    const result = await getInfo(user);
    return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({error:"Something went wrong"})
    }


})

module.exports = router;