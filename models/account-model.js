const bcrypt = require("bcrypt");
const pool = require("../database");

async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password,
) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword,
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

async function checkPasswordCombo(account_email, account_password) {
  try {
    const sql = "SELECT account_password FROM account WHERE account_email = $1";
    const password = await pool.query(sql, [account_email]);
    if (password.rows.length === 0) {
      throw new Error("Wrong email or password.");
    }
    return await bcrypt.compare(
      account_password,
      password.rows[0].account_password,
    );
  } catch (err) {
    return err.message;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  checkPasswordCombo,
};
