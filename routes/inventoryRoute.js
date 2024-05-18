router = require("express").Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:invId", invController.buildDetailPage);

router.get("/", invController.buildManagementPage);

router.get("/add-classification", invController.buildAddClassificationPage);

router.get("/add-vehicle", invController.buildAddVehiclePage);

router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification,
);

router.post(
    "/add-vehicle",
    invValidate.addVehicleRules(),
    invValidate.checkVehicleData,
    invController.addVehicle,
);

module.exports = router;
