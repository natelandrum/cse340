const bcrypt = require('bcrypt');
const pool = require("../database");

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const hashedPassword = await bcrypt.hash(account_password, 10);
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword]);
    }
    catch (err) {
        console.error(err);
        throw new Error('An error occurred while registering the account');
    }
}

module.exports = {
    registerAccount
};