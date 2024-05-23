const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");
const { name } = require("ejs");

validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .isString()
      .isLength({ min: 2 })
      .isAlpha()
      .withMessage(
        "Classification name can only be letters and must be at least 2 characters long.",
      )
      .trim()
      .escape(),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const classification_name = req.body.classification_name;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    errors = errors.array().filter((error) => error.msg !== "Invalid value");
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      description: "Add Classification Page",
      classification_name,
    });
    return;
  }
  next();
};

validate.addVehicleRules = () => {
  return [
    body("classification_id")
      .isNumeric()
      .withMessage(
        "Classification id must come from one of the options provided.",
      )
      .trim()
      .escape()
      .custom(async (classification_id) => {
        const classification =
          await invModel.getClassificationById(classification_id);
        if (!classification) {
          throw new Error("Classification does not exist.");
        }
      }),
    body("inv_make")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long.")
      .trim()
      .escape(),
    body("inv_model")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long.")
      .trim()
      .escape(),
    body("inv_description")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Description must be at least 3 characters long.")
      .trim()
      .escape(),
    body("inv_image")
      .matches(/\/images\/vehicles\/[a-zA-Z0-9_]+\.(jpg|png)$/)
      .withMessage("Image must be a valid path.")
      .trim(),
    body("inv_thumbnail")
      .matches(/\/images\/vehicles\/[a-zA-Z0-9_]+(-tn)?\.(jpg|png)$/)
      .withMessage("Thumbnail must be a valid path.")
      .trim(),
    body("inv_price")
      .isNumeric()
      .withMessage("Price must be a valid number (Decimal or Integer).")
      .trim()
      .escape(),
    body("inv_year")
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be a 4-digit number.")
      .trim()
      .escape(),
    body("inv_miles")
      .isNumeric()
      .isInt()
      .withMessage("Mileage must be an integer.")
      .trim()
      .escape(),
    body("inv_color")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters long.")
      .trim()
      .escape(),
  ];
};

validate.checkVehicleData = async (req, res, next) => {
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
  let errors = [];
  let classifications =
    await utilities.buildClassificationList(classification_id);
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    errors = errors.array().filter((error) => error.msg !== "Invalid value");
    res.render("inventory/add-vehicle", {
      title: "Add Vehicle",
      classifications,
      nav,
      errors,
      description: "Add Vehicles Page",
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_color,
      inv_miles,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id,
    });
    return;
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
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
  let errors = [];
  let classifications =
    await utilities.buildClassificationList(classification_id);
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    errors = errors.array().filter((error) => error.msg !== "Invalid value");
    let name = `${inv_make} ${inv_model}`;
    res.render("inventory/edit-vehicle", {
      title: "Edit " + name,
      classifications,
      nav,
      errors,
      description: "Edit Vehicles Page",
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_color,
      inv_miles,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id,
      inv_id,
    });
    return;
  }
  next();
};

module.exports = validate;
