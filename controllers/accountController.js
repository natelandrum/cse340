utilities = require("../utilities");
accountModel = require("../models/account-model");

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    let description = "Login to your account";
    res.render("account/login", {
        title: "Login",
        nav,
        description
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

async function registerAccount(req, res, next) {
    let nav = await utilities.getNav();
    let description = "Register for an account";
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    const regResult = await accountModel.registerAccount(
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password
    );

    if (regResult) {
        req.flash("notice", `Congratulations, you're registered ${account_firstname}! Please log in.`);
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            description: "Login to your account"
        });
        }
    else {
        req.flash("notice", "Sorry, the registration failed. Please try again.");
        res.status(501).render("account/register", {
            title: "Register",
            nav,
            description
        });
    }
}

module.exports = {
    buildLogin,
    buildRegistration,
    registerAccount
};