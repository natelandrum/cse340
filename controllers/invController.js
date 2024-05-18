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

invCont.buildManagementPage = async function (req, res, next) {
  try {
    const grid = await utilities.buildManagementPage();
    let nav = await utilities.getNav();
    const description = "Inventory Management Page";
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      grid,
      description,
    });
  } catch (error) {
    next({
      status: "Server Error",
      message: "Inventory Management Page Error.",
    });
  }
};

invCont.buildAddClassificationPage = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const description = "Add Classification Page";
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      description,
      errors: null,
    });
  } catch (error) {
    next({
      status: "Server Error",
      message: "Add Classification Page Error.",
    });
  }
};

invCont.buildAddVehiclePage = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classifications = await utilities.buildClassificationList(null);
    const description = "Add Vehicle Page";
    res.render("./inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      description,
      classifications,
      errors: null,
    });
  } catch (error) {
    next({
      status: "Server Error",
      message: "Add Vehicle Page Error.",
    });
  }
};

invCont.addClassification = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    let description = "Add Classification Page";
    const classification_name = req.body.classification_name;

    const invResult = await invModel.addClassification(classification_name);

    if (invResult) {
      let grid = await utilities.buildManagementPage();
      req.flash("notice", `Congratulations, you added ${classification_name}.`);
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        grid,
        description,
        errors: null,
      });
    } else {
      req.flash(
        "notice",
        "Sorry, could not add classification. Please try again.",
      );
      res.status(501).render("/inventory/add-classification", {
        title: "Add Classification",
        nav,
        description,
        errors: null,
        classification_name,
      });
    }
  } catch(error) {
    next({
      status: "Server Error",
      message: "Add Classification Error.",
    });
  }
};

invCont.addVehicle = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    let description = "Add Vehicle Page";
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body;
    let classifications = await utilities.buildClassificationList(classification_id);

    const invResult = await invModel.addVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color);

    if (invResult) {
      let grid = await utilities.buildManagementPage();
      req.flash("notice", `Congratulations, you added ${inv_make} ${inv_model}.`);
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        grid,
        description,
        errors: null,
      });
    } else {
      req.flash(
        "notice",
        "Sorry, could not add vehicle. Please try again.",
      );
      res.status(501).render("./inventory/add-vehicle", {
        title: "Add Vehicle",
        nav,
        description,
        errors: null,
        classifications,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
      });
    }
  } catch (error) {
    next({
      status: "Server Error",
      message: "Add Vehicle Error.",
    });
  }
  
};

module.exports = invCont;
