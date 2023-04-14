const { pool } = require('./postgresDB');

async function getUserByEmail(email) {
    const sql = `
    SELECT *
    FROM users
    WHERE email = $1`

    try {
        const res = await pool.query(sql, [email])
        return res.rows[0];
    } catch (err) {
        console.error("Something went wrong getting the yahoo info:")
        console.error(err);
    }
}

async function createUser(userData) {
    const sql = `
    INSERT INTO users (email, password, salt, datecreated)
    VALUES ($1, $2, $3, NOW())
    RETURNING *;
    `

    try {
        const res = await pool.query(sql, [userData.email, userData.password, userData.salt])
        return res.rows[0];
    } catch(err) {
        console.log("Something went wrong creating the user");
        console.error(err);
    }
}

module.exports = {getUserByEmail, createUser}