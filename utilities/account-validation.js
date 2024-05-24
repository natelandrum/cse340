const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model");

validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address.")
      .custom(async (account_email) => {
        const emailExists =
          await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error(
            "Email exists. Please log in or use a different email.",
          );
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address.")
      .custom(async (account_email) => {
        const emailExists =
          await accountModel.checkExistingEmail(account_email);
        if (!emailExists) {
          throw new Error("Invalid email. Please register or try again.");
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

validate.updateInfoRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address.")
      .custom(async (account_email, { req }) => {
        const emailExists =
          await accountModel.checkExistingEmail(account_email);
        if (emailExists && account_email !== req.body.old_email) {
          throw new Error(
            "Email exists. Please log in or use a different email."
          );
        } 
      }),
  ];
}

validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
}

validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    errors = errors.array().filter((error) => error.msg !== "Invalid value");
    res.render("account/register", {
      errors,
      title: "Registration",
      description: "Register for an account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

validate.checkLoginData = async (req, res, next) => {
  const account_email = req.body.account_email;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors = errors.array().filter((error) => error.msg !== "Invalid value");
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      description: "Login to your account",
      nav,
      account_email,
    });
    return;
  }
  next();
};

validate.checkUpdateInfoData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors = errors.array().filter((error) => error.msg !== "Invalid value");
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Update Account",
      description: "Update your account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
    return;
  }
  next();
};

validate.checkUpdatePasswordData = async (req, res, next) => {
  const account_id = req.body.account_id;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors = errors.array().filter((error) => error.msg !== "Invalid value");
    let nav = await utilities.getNav();
    res.render("account/update/" + account_id, {
      errors,
      title: "Update Account",
      description: "Update your account",
      nav,
      account_id,
    });
    return;
  }
  next();
};

module.exports = validate;
