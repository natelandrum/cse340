router = require("express").Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");

router.get("/login", accountController.buildLogin);

router.get("/register", accountController.buildRegistration);

router.get("/",
  utilities.checkLogin,
  accountController.buildAccountManagement
);

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  accountController.registerAccount,
);

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accountController.accountLogin,
);

module.exports = router;
