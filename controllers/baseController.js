const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  const description =
    "CSE Motors Home Page with information about the Delorean, its upgrades, and some reviews.";
  res.render("index", { title: "Home", nav, description });
};

module.exports = baseController;
