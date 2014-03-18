import { client } from "./apiConfig";

function getInventoryItemsAPI(channel, status, page, per_page, sort, sort_order, search_string) {
  let url = "/api/v1/inventory_item/?channel=" + channel + "&status=" + status + "&page_size=" + per_page + "&page=" + page + "&sort=" + sort + "&sort_order=" + sort_order + "&search_string=" + search_string;
  return client
    .get(url)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getResultOfUploadingInventoryItemsFileAPI(batchUploadId) {
  return client
    .get("/api/v1/inventory_item/upload", batchUploadId)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function postUploadInventoryItemsFileAPI(data) {
  return client
    .post("/api/v1/inventory_item/upload", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getStrandedItemsAPI(channel) {
  const url = "/api/v1/inventory_item/stranded?fulfilledby=" + channel;
  return client
    .get(url)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

export {
  getInventoryItemsAPI,
  postUploadInventoryItemsFileAPI,
  getResultOfUploadingInventoryItemsFileAPI,
  getStrandedItemsAPI,
};
