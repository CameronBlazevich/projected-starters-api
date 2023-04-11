const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./my-database.db');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../request-handling/middleware')


router.post("/", async (req, res) => {
    var errors = []
    try {
        const { email, password } = req.body;

        if (!email) {
            errors.push("Email is missing");
        }
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        let userExists = false;
        let user={};


        var sql = "SELECT * FROM Users WHERE Email = ?"
        await db.all(sql, email, (err, result) => {
            if (err) {
                res.status(402).json({ "error": err.message });
                return;
            }

            if (result.length === 0) {

                var salt = bcrypt.genSaltSync(10);

                var data = {
                    email: email,
                    password: bcrypt.hashSync(password, salt),
                    Salt: salt,
                    DateCreated: Date('now')
                }

                var sql = 'INSERT INTO Users (Email, Password, Salt, DateCreated) VALUES (?,?,?,?)'
                var params = [data.email, data.password, data.Salt, Date('now')]
                user = db.run(sql, params, function (err, innerResult) {
                    if (err) {
                        res.status(400).json({ "error": err.message })
                        return;
                    }
                    // * CREATE JWT TOKEN
                    const token = jwt.sign(
                        { user_id: user.Id, Email: user.email },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                        }
                    );

                    user.Token = token;

                });
            }
            else {
                userExists = true;
                // res.status(404).send("User Already Exist. Please Login");  
            }
        });

        setTimeout(() => {
            if (!userExists) {

                res.status(201).json(user);
            } else {
                res.status(201).json("Record already exists. Please login");
            }
        }, 500);


    } catch (err) {
        console.log(err);
    }
})

module.exports = router