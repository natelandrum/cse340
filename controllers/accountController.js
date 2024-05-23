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
      return res.redirect("/account/");
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

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildAccount,
};
