router = require("express").Router();
const invController = require("../controllers/invController");

router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:invId", invController.buildDetailPage);

module.exports = router;
