router = require("express").Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

router.get("/login", accountController.buildLogin);

router.get("/register", accountController.buildRegistration);

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
  (req, res) => {
    res.status(200).send("Login successful");
  },
);

module.exports = router;
