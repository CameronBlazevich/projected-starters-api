const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./my-database.db');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../request-handling/middleware')


router.post("/test", auth, (req, res) => {
    res.status(200).send("Valid Token - Yay!");
});

router.post('/', async (req, res) => {
  const fooValue = req.params.foo;
  const barValue = req.params.bar;

  try {      
    const { email, password } = req.body;
    // console.log(Email, Password)
        // Make sure there is an Email and Password in the request
        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }
            
        let user = [];
        
        var sql = "SELECT * FROM Users WHERE Email = ?";
        db.all(sql, email, function(err, rows) {
            if (err){
                res.status(400).json({"error": err.message})
                return;
            }

            rows.forEach(function (row) {
                user.push(row);                
            })
            
            if (user?.length === 0) {
                // console.log("no user found")
                return res.status(400).send("Email not found");  
            }

            var PHash = bcrypt.hashSync(password, user[0].Salt);
       
            if(PHash === user[0].Password) {
                // * CREATE JWT TOKEN
                const token = jwt.sign(
                    { user_id: user[0].Id, Email: email },
                      process.env.TOKEN_KEY,
                    {
                      expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                    }  
                );

                user[0].Token = token;

            } else {
                return res.status(400).send("No Match");          
            }

           return res.status(200).send(user);                
        });	
    
    } catch (err) {
      console.log(err);
    }    
});

module.exports = router;
