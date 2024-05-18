const pool = require("../database/");

async function getClassifications() {
  try {
    return await pool.query(
      "SELECT * FROM classification ORDER BY classification_name",
    );
  } catch (error) {
    console.error(`getclassifications error: ${error}`);
  }
}

async function getClassificationById(classification_id) {
  try {
    return await pool.query(
      "SELECT * FROM classification WHERE classification_id = $1",
      [classification_id],
    );
  } catch (error) {
    console.error(`getclassifications error: ${error}`);
  }
}
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory AS i
      JOIN classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id],
    );
    return data.rows;
  } catch (error) {
    console.error(`getinventorybyclassificationid error: ${error}`);
  }
}

async function getInventoryDetail(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory
      WHERE inv_id = $1`,
      [inv_id],
    );
    return data.rows[0];
  } catch (error) {
    console.error(`getinventorydetail error: ${error}`);
  }
}

async function addClassification(classification_name) {
  try {
    await pool.query(
      `INSERT INTO classification (classification_name)
      VALUES ($1)`,
      [classification_name],
    );
    return true;
  } catch (error) {
    console.error(`addclassification error: ${error}`);
    return false;
  }
}

async function addVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
  try {
    await pool.query(
      `INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color],
    );
    return true;
  } catch (error) {
    console.error(`addvehicle error: ${error}`);
    return false;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryDetail,
  addClassification,
  addVehicle,
  getClassificationById,
};
