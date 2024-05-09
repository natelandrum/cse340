const invModel = require("../models/inventory-model");

const Util = {};

Util.getNav = async () => {
  const { rows } = await invModel.getClassifications();
  const listItems = rows
    .map(
      (row) => `
  <li>
    <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
      ${row.classification_name}
    </a>
  </li>
`,
    )
    .join("");

  return `
    <ul>
      <li><a href="/" title="Home page">Home</a></li>
      ${listItems}
    </ul>
  `;
};

Util.buildByClassificationGrid = async function (data) {
  if (data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

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

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
