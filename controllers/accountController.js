require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

utilities = require("../utilities");
accountModel = require("../models/account-model");

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  let description = "Login to your account";
  res.render("account/login", {
    title: "Login",
    nav,
    description,
    errors: null,
  });
}

async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  let description = "Register for an account";
  res.render("account/register", {
    title: "Register",
    nav,
    description,
    errors: null,
  });
}

async function buildAccount(req, res, next) {
  let nav = await utilities.getNav();
  let description = "Your account";
  res.render("account/account", {
    title: "Account",
    nav,
    description,
    errors: null,
  });
}

async function registerAccount(req, res, next) {
  let nav = await utilities.getNav();
  let description = "Register for an account";
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const hashedPassword = await bcrypt.hash(account_password, 10);

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}! Please log in.`,
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      description: "Login to your account",
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed. Please try again.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      description,
      errors: null,
    });
  }
}

async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 },
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account");
    } else {
      // Passwords do not match
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        description: "Login to your account",
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

async function buildUpdateAccount(req, res, next) {
  const account_id = req.params.accountId;
  const accountData = await accountModel.getAccountById(account_id);
  let nav = await utilities.getNav();
  let description = "Update your account";
  res.render("account/update", {
    title: "Update Account",
    nav,
    description,
    errors: null,
    account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  });
}

async function logout(req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "You are now logged out");
  res.redirect("/account/login");
}

async function updateAccount(req, res, next) {
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body;

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (updateResult) {
      const accountData = await accountModel.getAccountByEmail(updateResult.account_email);
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 },
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      }
      else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }

    req.flash("notice", "Account updated successfully");
    res.status(201).redirect("/account",);
  } else {
    let nav = await utilities.getNav();
    req.flash("notice", "Account update failed. Please try again.");
    res.status(501).render("account/update",
      {
        title: "Update Account",
        nav,
        description: "Update your account",
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email
      });
  }
}

async function updatePassword(req, res, next) {
  const {
    account_id,
    account_password
  } = req.body;

  const hashedPassword = await bcrypt.hash(account_password, 10);

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );

  if (updateResult) {
    req.flash("notice", "Password updated successfully");
    res.status(201).redirect("/account");
  } else {
    req.flash("notice", "Password update failed. Please try again.");
    res.status(501).render("/account/update/" + account_id,
      {
        title: "Update Account",
        nav,
        description: "Update your account",
        errors: null,
        account_id,
      });
  }
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildAccount,
  buildUpdateAccount,
  logout,
  updateAccount,
  updatePassword
};
