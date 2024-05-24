router = require("express").Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities");

router.get(
  "/login",
  utilities.checkAlreadyLoggedIn,
  accountController.buildLogin
);

router.get(
  "/register", 
  accountController.buildRegistration
);

router.get(
  "/logout", 
  accountController.logout
);

router.get(
  "/update/:accountId",
  utilities.checkLogin(),
  utilities.checkUserIdentity,
  accountController.buildUpdateAccount
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

router.post(
  "/update/info",
  regValidate.updateInfoRules(),
  regValidate.checkUpdateInfoData,
  accountController.updateAccount,
)

router.post(
  "/update/password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  accountController.updatePassword,
)

router.get(
  "/", 
  utilities.checkLogin(), 
  accountController.buildAccount
);

module.exports = router;
