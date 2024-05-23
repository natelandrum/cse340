"use strict";

let classificationList = document.querySelector("#classificationList");
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);
  let classIdURL = "/inv/getInventory/" + classification_id;
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      buildInventoryList(data);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
});
function buildInventoryList(data) {
  const inventoryDisplay = document.getElementById("inventoryDisplay");

  const rows = data
    .map(
      (element) => `
    <tr>
      <td>${element.inv_make} ${element.inv_model}</td>
      <td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>
      <td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>
    </tr>
  `,
    )
    .join("");

  const dataTable = `
    <thead>
      <tr>
        <th>Vehicle Name</th>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  `;

  inventoryDisplay.innerHTML = dataTable;
}
