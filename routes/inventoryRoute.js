router = require("express").Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities");

router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:invId", invController.buildDetailPage);

router.post("/detail/:invId",
  utilities.checkLogin(),
  utilities.checkAdminPrivileges,
  invController.buildDetailPage
);

router.get("/",
  utilities.checkLogin(),
  utilities.checkAccessLevel,
  invController.buildManagementPage
);

router.get("/add-classification",
  utilities.checkLogin(),
  utilities.checkAccessLevel, 
  invController.buildAddClassificationPage
);

router.get("/add-vehicle", 
  utilities.checkLogin(),
  utilities.checkAccessLevel,
  invController.buildAddVehiclePage
);

router.get("/getInventory/:classification_id", invController.getInventoryJSON);

router.get("/edit/:invId",
  utilities.checkLogin(),
  utilities.checkAccessLevel,
  invController.buildEditPage
);

router.get("/delete/:invId", 
  utilities.checkLogin(),
  utilities.checkAccessLevel,
  invController.buildDeletePage
);

router.post(
  "/add-classification",
  utilities.checkLogin(),
  utilities.checkAccessLevel,
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification,
);

router.post(
  "/add-vehicle",
  utilities.checkLogin(),
  utilities.checkAccessLevel,
  invValidate.addVehicleRules(),
  invValidate.checkVehicleData,
  invController.addVehicle,
);

router.post(
  "/edit/:invId",
  utilities.checkLogin(),
  utilities.checkAccessLevel,
  invValidate.addVehicleRules(),
  invValidate.checkUpdateData,
  invController.updateVehicle,
);

router.post("/delete/:invId",
  utilities.checkLogin(),
  utilities.checkAccessLevel, 
  invController.deleteVehicle
);

router.get("/approval",
  utilities.checkLogin(),
  utilities.checkAdminPrivileges,
  invController.buildApprovalPage
);

router.get("/approve/classification/:classificationId",
  utilities.checkLogin(),
  utilities.checkAdminPrivileges,
  invController.approveClassification
);

router.get("/reject/classification/:classificationId",
  utilities.checkLogin(),
  utilities.checkAdminPrivileges,
  invController.rejectClassification
);

router.get("/approve/vehicle/:invId",
  utilities.checkLogin(),
  utilities.checkAdminPrivileges,
  invController.approveVehicle
);

router.get("/reject/vehicle/:invId",
  utilities.checkLogin(),
  utilities.checkAdminPrivileges,
  invController.rejectVehicle
);

module.exports = router;
