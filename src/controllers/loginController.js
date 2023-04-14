const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./my-database.db');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../request-handling/middleware')
const { getUserByEmail } = require('../database/users')


router.post("/test", auth, (req, res) => {
    res.status(200).send("Valid Token - Yay!");
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).send("Email and Password are required");
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).send("Email not found");
        }

        const PHash = bcrypt.hashSync(password, user.salt);

        if (PHash === user.password) {
            const token = jwt.sign(
                { user_id: user.id, email: email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                }
            );

            const loggedIn = {
                email: user.email,
                token: token
            }

            return res.status(200).send(loggedIn);
        } else {
            return res.status(401).send("Incorrect password");
        }

    } catch (err) {
        console.error(err);
        return res.status(500).send("Something went wrong")
    }
});

module.exports = router;
