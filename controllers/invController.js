const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildByClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  const description = `Inventory page for ${className} vehicles`;
  res.render("./inventory/classification", {
    title: `${className} Vehicles`,
    nav,
    grid,
    description,
  });
};

module.exports = invCont;
