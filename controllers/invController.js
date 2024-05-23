const { name } = require("ejs");
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
    const classificationSelect = await utilities.buildClassificationList();
    const description = "Inventory Management Page";
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      grid,
      description,
      classificationSelect,
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
  } catch (error) {
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
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    } = req.body;
    let classifications =
      await utilities.buildClassificationList(classification_id);

    const invResult = await invModel.addVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    );

    if (invResult) {
      let grid = await utilities.buildManagementPage();
      req.flash(
        "notice",
        `Congratulations, you added ${inv_make} ${inv_model}.`,
      );
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        grid,
        description,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, could not add vehicle. Please try again.");
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

invCont.updateVehicle = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    let description = "Edit Vehicle Page";
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    } = req.body;
    let classifications =
      await utilities.buildClassificationList(classification_id);

    const updateResult = await invModel.updateVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    );

    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
      req.flash("notice", `Congratulations, you updated ${itemName}.`);
      res.redirect("/inv");
    } else {
      name = `${inv_make} ${inv_model}`;
      req.flash("notice", "Sorry, could not update vehicle. Please try again.");
      res.status(501).render("./inventory/edit-vehicle", {
        title: "Edit " + name,
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
        inv_id,
      });
    }
  } catch (error) {
    next({
      status: "Server Error",
      message: "Edit Vehicle Error.",
    });
  }
};

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData =
    await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

invCont.buildEditPage = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId);
    let nav = await utilities.getNav();
    const description = "Edit Vehicle Page";
    invData = await invModel.getInventoryDetail(inv_id);
    const classifications = await utilities.buildClassificationList(
      invData.classification_id,
    );

    const name = `${invData.inv_make} ${invData.inv_model}`;
    res.render("./inventory/edit-vehicle", {
      title: "Edit " + name,
      nav,
      description,
      classifications,
      inv_id,
      inv_make: invData.inv_make,
      inv_model: invData.inv_model,
      inv_description: invData.inv_description,
      inv_image: invData.inv_image,
      inv_thumbnail: invData.inv_thumbnail,
      inv_price: invData.inv_price,
      inv_year: invData.inv_year,
      inv_miles: invData.inv_miles,
      inv_color: invData.inv_color,
      errors: null,
    });
  } catch (error) {
    next({
      status: "Server Error",
      message: "Edit Vehicle Page Error.",
    });
  }
};

module.exports = invCont;
