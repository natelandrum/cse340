const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    let data =
      await invModel.getInventoryByClassificationId(classification_id);
    const approved = data.some((item) => item.inv_approved === true);
    if (approved) {
      data = data.filter((item) => item.inv_approved === true);
    } else {
      return res.redirect("/");
    }

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
    if (!data.inv_approved && req.method === "GET") {
      return res.redirect("/");
    }
    const grid = await utilities.buildDetailPage(data);
    if (req.method === "POST") {
      return res.send(grid);
    }
    let nav = await utilities.getNav();
    const description = `Details for ${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      grid,
      description,
    });
  } catch (error) {
    console.error('Error:', error);
    next(error);
  }
};

invCont.buildManagementPage = async function (req, res, next) {
  try {
    const grid = await utilities.buildManagementPage();
    let nav = await utilities.getNav();
    const classifications = await utilities.buildClassificationList();
    const description = "Inventory Management Page";
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      grid,
      description,
      classifications,
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
    let classifications = await utilities.buildClassificationList();
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
      let classifications = await utilities.buildClassificationList();
      req.flash("notice", `Congratulations, ${classification_name} has been submitted for approval.`);
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        nav,
        grid,
        description,
        classifications,
        errors: null,
      });
    } else {
      req.flash(
        "notice",
        "Sorry, could not submit classification. Please try again.",
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
        `Congratulations, ${inv_make} ${inv_model} has been submitted for approval.`,
      );
      res.status(201).render("./inventory/management", {
        title: "Inventory Management",
        classifications,
        nav,
        grid,
        description,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, could not submit vehicle. Please try again.");
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
      req.flash("notice", `Congratulations, you submitted ${itemName} edit for approval.`);
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

invCont.buildDeletePage = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId);
    let nav = await utilities.getNav();
    const description = "Delete Vehicle Page";
    invData = await invModel.getInventoryDetail(inv_id);
    const name = `${invData.inv_make} ${invData.inv_model}`;
    res.render("./inventory/delete-confirm", {
      title: "Delete " + name,
      nav,
      description,
      errors: null,
      inv_id,
      inv_make: invData.inv_make,
      inv_model: invData.inv_model,
      inv_price: invData.inv_price,
      inv_year: invData.inv_year,
    });
  } catch (error) {
    next({
      status: "Server Error",
      message: "Delete Vehicle Page Error.",
    });
  }
};

invCont.deleteVehicle = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId);
    const invData = await invModel.getInventoryDetail(inv_id);
    const deleteResult = await invModel.deleteVehicle(inv_id);
    if (deleteResult) {
      req.flash(
        "notice",
        `You deleted ${invData.inv_make} ${invData.inv_model}.`,
      );
      res.redirect("/inv");
    } else {
      req.flash("notice", "Sorry, could not delete vehicle. Please try again.");
      res.status(501).render("./inventory/delete-confirm", {
        title: "Delete " + name,
        nav,
        description,
        errors: null,
        inv_id,
        inv_make: invData.inv_make,
        inv_model: invData.inv_model,
        inv_price: invData.inv_price,
        inv_year: invData.inv_year,
      });
    }
  } catch (error) {
    next({
      status: "Server Error",
      message: "Delete Vehicle Error.",
    });
  }
};

invCont.buildApprovalPage = async function (req, res, next) {
  try {
    const grid = await utilities.buildApprovalPage();
    let nav = await utilities.getNav();
    const description = "Inventory Approval Page";
    res.render("./inventory/approval", {
      title: "Inventory Approval",
      nav,
      grid,
      description,
      errors: null,
    });
  } catch (error) {
    next({
      status: "Server Error",
      message: "Inventory Approval Page Error.",
    });
  }
};

invCont.approveClassification = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId);
    const account_id = res.locals.accountData.account_id;
    const approveResult = await invModel.approveClassification(classification_id, account_id);
    if (approveResult) {
      req.flash("notice", "Classification Approved.");
      res.redirect("/inv/approval");
    } else {
      req.flash("notice", "Sorry, could not approve classification. Please try again.");
      res.redirect("/inv/approval");
    }
  } catch (error) {
    next({
      status: "Server Error",
      message: "Approve Classification Error.",
    });
  }
};

invCont.approveVehicle = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId);
    const account_id = res.locals.accountData.account_id;
    const approveResult = await invModel.approveVehicle(inv_id, account_id);
    if (approveResult) {
      req.flash("notice", "Vehicle Approved.");
      res.redirect("/inv/approval");
    } else {
      req.flash("notice", "Sorry, could not approve vehicle. Please try again.");
      res.redirect("/inv/approval");
    }
  } catch (error) {
    next({
      status: "Server Error",
      message: "Approve Vehicle Error.",
    });
  }
};

invCont.rejectClassification = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId);
    const rejectResult = await invModel.rejectClassification(classification_id);
    if (rejectResult) {
      req.flash("notice", "Classification Rejected.");
      res.redirect("/inv/approval");
    } else {
      req.flash("notice", "Sorry, could not reject classification. Please try again.");
      res.redirect("/inv/approval");
    }
  } catch (error) {
    next({
      status: "Server Error",
      message: "Reject Classification Error.",
    });
  }
};

invCont.rejectVehicle = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId);
    const rejectResult = await invModel.rejectVehicle(inv_id);
    if (rejectResult) {
      req.flash("notice", "Vehicle Rejected.");
      res.redirect("/inv/approval");
    } else {
      req.flash("notice", "Sorry, could not reject vehicle. Please try again.");
      res.redirect("/inv/approval");
    }
  } catch (error) {
    next({
      status: "Server Error",
      message: "Reject Vehicle Error.",
    });
  }
};

module.exports = invCont;
