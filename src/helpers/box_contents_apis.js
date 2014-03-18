import { client } from "./apiConfig";

function getShipmentsListAPI() {
  return client
    .get("/api/v1/box_contents/shipments_list")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getShipmentAPI(shipmentId) {
  return client
    .get("/api/v1/box_contents/shipment?shipmentId=" + encodeURIComponent(shipmentId))
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateCurrentShipmentBoxAPI(data) {
  return client
    .patch("/api/v1/box_contents/current_box", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function addShipmentBoxAPI(data) {
  return client
    .post("/api/v1/box_contents/shipment_box", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function searchProductAPI(query) {
  return client
    .get("api/v1/search/products?query=" + encodeURIComponent(query))
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function addItemToBox(boxId, itemJson) {
  return client
    .post("api/v1/box_contents/shipment_box_item_v2", {
      boxId,
      itemJson: JSON.stringify(itemJson)
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function delItemFromBox(boxId, itemId) {
  return client
    .delete("/api/v1/box_contents/shipment_box_item_v2", {
      data : {
        boxId,
        itemId
      }
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateItemCount(itemId, quantity) {
  return client
    .put("api/v1/box_contents/shipment_box_item_v2", {
      itemId,
      quantity
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function moveItemToBox(toBox, itemId, moveQuantity) {
  return client
    .patch("api/v1/box_contents/shipment_box_item_v2", {
      toBox,
      itemId,
      moveQuantity
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

export {
  getShipmentsListAPI,
  getShipmentAPI,
  addShipmentBoxAPI,
  searchProductAPI,
  addItemToBox,
  updateItemCount,
  moveItemToBox,
  updateCurrentShipmentBoxAPI,
  delItemFromBox
};
