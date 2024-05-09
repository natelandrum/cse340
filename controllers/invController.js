const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data =
      await invModel.getInventoryByClassificationId(classification_id);
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
  } catch (error) {
    next({
      status: "Server Error",
      message: "Classification Id out of range.",
    });
  }
};

invCont.buildDetailPage = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryDetail(inv_id);
    const grid = await utilities.buildDetailPage(data);
    let nav = await utilities.getNav();
    const description = `Details for ${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      grid,
      description,
    });
  } catch (error) {
    next({
      status: "Server Error",
      message: "Inventory Id out of range.",
    });
  }
};

module.exports = invCont;
