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
        let user = {};


        var sql = "SELECT * FROM Users WHERE Email = ?"
        await db.all(sql, email, (err, result) => {
            if (err) {
                console.error("Something went wrong querying db for user in registerController")
                console.error(err)
                return res.status(500).send("Database error");
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
                        console.error("Could not insert new user into database for register request");
                        console.error(err);
                        return res.status(500).json({ "error": err.message })
                    }
                });

                let created = [];
                var sql = "SELECT * FROM Users WHERE Email = ?";
                db.all(sql, email, function (err, rows) {
                    if (err) {
                        return res.status(500).json({ "error": err.message })
                    }

                    rows.forEach(function (row) {
                        created.push(row);
                    })


                    // * CREATE JWT TOKEN
                    const token = jwt.sign(
                        { user_id: created[0].Id, email: email },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                        }
                    );

                    created[0].Token = token;

                    user = created[0]


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
                res.status(400).json({error: "Record already exists. Please login"});
            }
        }, 500);


    } catch (err) {
        console.error(err);
        return res.status(500).send("Something went wrong")
    }
})

module.exports = router