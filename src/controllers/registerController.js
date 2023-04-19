const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./my-database.db');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getUserByEmail, createUser } = require('../database/users')

router.post("/", async (req, res) => {
    var errors = []
    try {
        const { email, password } = req.body;

        if (!email) {
            errors.push("Email is missing");
        }

        if (!password) {
            errors.push("Password is missing");
        }

        if (errors.length) {
            return res.status(400).json({message: errors.join(",") });
        }

        const user = await getUserByEmail(email)

        if (user) {
            res.status(400).json({ message: "Record already exists. Please login" });
        } else {
            const salt = bcrypt.genSaltSync(10)
            const phash = bcrypt.hashSync(password, salt);

            const userData = {
                email: email,
                password: phash,
                salt: salt,
            }
            const created = await createUser(userData);
            // * CREATE JWT TOKEN
            const token = jwt.sign(
                { user_id: created.id, email: email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                }
            );

            const newUser = {
                email: created.email,
                token: token,
            }

            return res.status(201).json(newUser);;
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Something went wrong"})
    }
})

module.exports = router