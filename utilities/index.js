const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

Util.getNav = async () => {
  const data = await invModel.getClassifications();
  const listItems = data.rows
    .map(
      (row) => {
        if (row.classification_approved && row.has_approved_inv) {
          return `
          <li>
            <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
              ${row.classification_name}
            </a>
          </li>
        `
        }
      },
    )
    .join("");

  return `
    <ul class="menuLinks">
      <li><a href="/" title="Home page">Home</a></li>
      ${listItems}
    </ul>
  `;
};

Util.buildByClassificationGrid = async function (data) {
  const gridItems = data
    .map(
      (vehicle) => `
    <li>
      <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
      </a>
      <div class="namePrice">
        <h2>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            ${vehicle.inv_make} ${vehicle.inv_model}
          </a>
        </h2>
        <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
      </div>
    </li>
  `,
    )
    .join("");

  return `<ul id="inv-display">${gridItems}</ul>`;
};

Util.buildDetailPage = async function (data) {
  return `
    <div class="detail-grid">
      <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}" />
      <div class="detail-info">
        <p class="details">${data.inv_make} ${data.inv_model} Details</p>
        <div class="indent">
          <p class="price">Price: $${new Intl.NumberFormat("en-US").format(data.inv_price)}</p>
          <p class="description"><span class="firstWord">Description:</span> ${data.inv_description}</p>
          <p class="color"><span class="firstWord">Color:</span> ${data.inv_color}</p>
          <p class="miles"><span class="firstWord">Miles:</span>: ${new Intl.NumberFormat("en-US").format(data.inv_miles)}</p>
        </div>
        </div>
    </div>
      `;
};

Util.buildManagementPage = async function () {
  return `
    <div class="management">
      <a href="/inv/add-classification" title="Add a classification to the inventory">Add a New Classification</a>
      <a href="/inv/add-vehicle" title="Add a vehicle to the inventory">Add a New Vehicle</a>
    </div>
    `;
};

Util.buildClassificationList = async function (classification_id = null) {
  const { rows } = await invModel.getClassifications();
  let options = rows
    .map(
      (row) => `
    <option value="${row.classification_id}" ${row.classification_id == classification_id ? "selected" : ""}>
      ${row.classification_name}
    </option>
  `,
    )
    .join("");

  options =
    `<option ${options.includes("selected") ? "" : "selected"} disabled value="">Select a classification</option>` +
    options;

  return options;
};

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      },
    );
  } else {
    next();
  }
};

Util.checkLogin = () => (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in");
    res.redirect("/account/login");
  }
};

Util.checkAlreadyLoggedIn = (req, res, next) => {
  if (res.locals.loggedin) {
    req.flash("notice", "You are already logged in");
    res.redirect("/account");
  } else {
    next();
  }

}

Util.checkAccessLevel = (req, res, next) => {
  if (res.locals.accountData.account_type !== "Client") {
    next();
  } else {
    req.flash("notice", "You do not have access to this page");
    res.redirect("/account/login");
  }
}

Util.checkAdminPrivileges = (req, res, next) => {
  if (res.locals.accountData.account_type === "Admin") {
    next();
  } else {
    req.flash("notice", "You do not have access to this page");
    res.redirect("/account/login");
  }
}

Util.checkUserIdentity = (req, res, next) => {
  if (res.locals.accountData.account_id == req.params.accountId) {
    next();
  } else {
    req.flash("notice", "Access Forbidden");
    res.status(403).redirect("/account");
  }
}

Util.buildApprovalPage = async function () {
  let data = await invModel.getUnapprovedClassifications();
  let classifications;
  if (!data.rows.length) {
    classifications = `
      <tr>
        <td colspan="3">No classifications to approve</td>
      </tr>
    `;
  } else {
    classifications = data.rows
      .map(
        (row) => `
      <tr>
        <td>${row.classification_name}</td>
        <td><a href="/inv/approve/classification/${row.classification_id}" title="Approve ${row.classification_name} classification">Approve</a></td>
        <td><a href="/inv/reject/classification/${row.classification_id}" title="Reject ${row.classification_name} classification">Reject</a></td>
      </tr>
    `,
      )
      .join("");
  }
  
  data = await invModel.getUnapprovedInventory();
  let vehicles;
  if (data.rows.length === 0) {
    vehicles = `
      <tr>
        <td colspan="4">No vehicles to approve</td>
      </tr>
    `;
  } else {
    vehicles = data.rows
      .map(
        (row) => `
      <tr>
        <td>${row.inv_make} ${row.inv_model}</td>
        <td><a href="#" class="modal-link" data-id="${row.inv_id}" title="View ${row.inv_make} ${row.inv_model}">View</a></td>
        <td><a href="/inv/approve/vehicle/${row.inv_id}" title="Approve ${row.inv_make} ${row.inv_model}">Approve</a></td>
        <td><a href="/inv/reject/vehicle/${row.inv_id}" title="Reject ${row.inv_make} ${row.inv_model}">Reject</a></td>
      </tr>
    `,
      )
      .join("");
  }

  return `
    <div class="approval">
      <h2>Approve Classifications</h2>
      <table>
        <thead>
          <tr>
            <th>Classification</th>
            <th>Approve</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          ${classifications}
        </tbody>
      </table>
      <h2>Approve Vehicles</h2>
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>View</th>
            <th>Approve</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          ${vehicles}
        </tbody>
      </table>
    </div>
  `;
};

module.exports = Util;
