const pool = require("../database/");

async function getClassifications() {
  try {
    return await pool.query(
      `SELECT c.*, COUNT(i.inv_approved) > 0 as has_approved_inv
       FROM classification as c
       LEFT JOIN inventory as i
       ON c.classification_id = i.classification_id
       WHERE i.inv_approved = true
       GROUP BY c.classification_id
       ORDER BY c.classification_name`,
    );
  } catch (error) {
    console.error(`getclassifications error: ${error}`);
  }
}

async function getUnapprovedClassifications() {
  try {
    return await pool.query(
      `SELECT *
       FROM classification
       WHERE classification_approved = false`,
    );
  } catch (error) {
    console.error(`getUnapprovedClassifications error: ${error}`);
  }
}

async function getUnapprovedInventory() {
  try {
    return await pool.query(
      `SELECT *
       FROM inventory
       WHERE inv_approved = false`,
    );
  } catch (error) {
    console.error(`getUnapprovedInventory error: ${error}`);
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

async function addVehicle(
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
) {
  try {
    await pool.query(
      `INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
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
      ],
    );
    return true;
  } catch (error) {
    console.error(`addvehicle error: ${error}`);
    return false;
  }
}

async function updateVehicle(
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
) {
  try {
    const data = await pool.query(
      `UPDATE inventory
      SET classification_id = $1, inv_make = $2, inv_model = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_year = $8, inv_miles = $9, inv_color = $10
      WHERE inv_id = $11 RETURNING *`,
      [
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
      ],
    );
    return data.rows[0];
  } catch (error) {
    console.error(`editvehicle error: ${error}`);
    return false;
  }
}

async function deleteVehicle(inv_id) {
  try {
    const data = await pool.query(
      `DELETE FROM inventory
      WHERE inv_id = $1`,
      [inv_id],
    );
    return data;
  } catch (error) {
    console.error(`deletevehicle error: ${error}`);
    return false;
  }
}

async function approveClassification(classification_id, account_id) {
  try {
    await pool.query(
      `UPDATE classification
       SET classification_approved = true,
           account_id = $1,
           classification_approval_date = CURRENT_TIMESTAMP
       WHERE classification_id = $2`,
      [account_id, classification_id],
    );
    return true;
  } catch (error) {
    console.error(`approveclassification error: ${error}`);
    return false;
  }
}

async function rejectClassification(classification_id) {
  try {
    await pool.query(
      `DELETE FROM classification
       WHERE classification_id = $1`,
      [classification_id],
    );
    return true;
  } catch (error) {
    console.error(`rejectclassification error: ${error}`);
    return false;
  }
}

async function approveVehicle(inv_id, account_id) {
  try {
    await pool.query(
      `UPDATE inventory
       SET inv_approved = true,
            account_id = $1,
            inv_approved_date = CURRENT_TIMESTAMP
        WHERE inv_id = $2`,
      [account_id, inv_id],
    );
    return true;
  } catch (error) {
    console.error(`approvevehicle error: ${error}`);
    return false;
  }
}

async function rejectVehicle(inv_id) {
  try {
    await pool.query(
      `DELETE FROM inventory
       WHERE inv_id = $1`,
      [inv_id],
    );
    return true;
  } catch (error) {
    console.error(`rejectvehicle error: ${error}`);
    return false;
  }
}

module.exports = {
  getClassifications,
  getUnapprovedClassifications,
  getUnapprovedInventory,
  getInventoryByClassificationId,
  getInventoryDetail,
  addClassification,
  addVehicle,
  getClassificationById,
  updateVehicle,
  deleteVehicle,
  approveClassification,
  approveVehicle,
  rejectClassification,
  rejectVehicle,
};
