const bcrypt = require("bcrypt");
const pool = require("../database");

async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password,
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (err) {
    console.error(err);
    throw new Error("An error occurred while registering the account");
  }
}

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (err) {
    return err.message;
  }
}

async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    return await pool.query(sql, [account_email])
      .then((result) => {
        return result.rows[0];
      });
  } catch (err) {
    return new Error("No matching email found.");
  }

}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
};
