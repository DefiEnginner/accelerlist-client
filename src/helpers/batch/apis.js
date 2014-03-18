import { client } from "../apiConfig";
import $ from 'jquery';

function searchAmazonProductsAPI(query) {
  return client
    .get("/api/v1/search/products?query=" +
      encodeURIComponent(query) +
      "&include_replenishment_info=true")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function createNewBatchAPI(data) {
  return client
    .post("/api/v1/batch/", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getBatchDataAPI(batchId) {
  return client
    .get("/api/v1/batch/?batch_id=" + encodeURIComponent(batchId))
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateBatchDataAPI(data) {
  return client
    .put("/api/v1/batch/", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function deleteBatchAPI(data) {
  return client
    .delete("/api/v1/batch/", {
      data
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getBatchListAPI(filters = {}) {
  let url;
  let filtersEncodeQuery = filters;
  filtersEncodeQuery.filter_query = encodeURIComponent(filtersEncodeQuery.filter_query);
  // if (!filter || !filter.filter_method || !filter.filter_query) {
  url =`/api/v1/batch/list_v2?${$.param(filtersEncodeQuery)}`;
  return client
    .get(url)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getBatchProductsFeedAPI(feedSubmissionIds) {
  let feedSubmissionIdsString = feedSubmissionIds.join(",");

  return client
    .get(
      "/api/v1/batch/product_feed?feed_submission_ids=" +
        encodeURIComponent(feedSubmissionIdsString)
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function postProductsFeedToAmazonAPI(data) {
  return client
    .post("/api/v1/batch/product_feed", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function saveBatchItemAPI(data) {
  return client
    .post("/api/v1/batch_item/", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateBatchItemAPI(data) {
  return client
    .put("/api/v1/batch_item/", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function deleteBatchItemAPI(data) {
  let { batchId, sku } = data;
  return client
    .delete("/api/v1/batch_item/?batch_id=" + encodeURIComponent(batchId) + "&sku=" + encodeURIComponent(sku))
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function postPrivateBatchListingToAmazonAPI(data) {
  return client
    .post("/api/v1/private_batch/fulfillment_center_data", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function postLiveBatchListingToAmazonAPI(data) {
  return client
    .post("/api/v1/live_batch/fulfillment_center_data", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateItemQuantityOnAmazonAPI(data) {
  return client
    .put("/api/v1/live_batch/fulfillment_center_data", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function approveShipmentCreationAPI(data) {
  return client
    .post("/api/v1/live_batch/shipment_creation", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getPricingDataAPI(data) {
  return client
    .get(
      "/api/v1/competitor_pricing/?asin=" +
        encodeURIComponent(data.asin) +
        "&channel=" +
        encodeURIComponent(data.channel)
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function addToHoldingsAPI(data) {
  return client
    .post("/api/v1/holding_area/", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function bulkAddToHoldingAreaAPI(data) {
  return client
    .post("/api/v1/holding_area/bulk", data)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function getHoldingsAPI() {
  return client
    .get("/api/v1/holding_area/")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function deleteHoldingAreaListingAPI(sku) {
  return client
    .delete("/api/v1/holding_area/?sku=" + encodeURIComponent(sku))
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getSupplierListAPI() {
  return client
    .get("/api/v1/supplier/")
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function createNewSupplierAPI(newSupplier) {
  //using the post url for create new supplier
  // const url = "https://demo2044711.mockable.io/supplier_post";

  // create id
  return client
    .post("/api/v1/supplier/", {
      name: newSupplier
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function deleteSupplierAPI(supplierId) {
  const url = "/api/v1/supplier/?id=" + encodeURIComponent(supplierId);
  return client
    .delete(url)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function editSupplierAPI(supplierId, newSupplierName) {
  return client
    .put("/api/v1/supplier/", {
      id: supplierId,
      name: newSupplierName
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function createShipmentPlansAPI(data) {
  return client
    .post("/api/v1/private_batch/plan_creation/job", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getShipmentPlanCreationStatusAPI(data) {
  return client
    .post("/api/v1/private_batch/plan_creation/result", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function createHoldingAreaShipmentAPI(data) {
  return client
    .post("/api/v1/private_batch/holding_area_shipment_creation", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function addBoxInfoForLiveBatchShipmentAPI(data) {
  return client
    .post("/api/v1/live_batch/box_info", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function createShipmentAPI(data) {
  return client
    .post("/api/v1/private_batch/shipment_creation", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateBoxInfoForLiveBatchShipmentAPI(data) {
  return client
    .put("/api/v1/live_batch/box_info", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateListingDefaultsDataAPI(batchId, data) {
  const reqBody = {
    batchId: batchId,
    updatedData: {
      ...data
    }
  };
  return client
    .put("/api/v1/batch/listing_defaults", reqBody)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function completeBatchApi(batchId) {
  return client
    .put("/api/v1/batch/complete", {
      batchId
    })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function getAdditionalInformationOfShipmentItemsAPI(shipmentId, skus, inputFields) {
  return client
    .post("/api/v1/batch_item/sku_by_shipment_id",
      {
        shipmentId,
        skus,
        inputFields
      }
    )
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getBatchHistoryStatsAPI() {
  return client
    .get("/api/v1/batch/statistics")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function funnyFacebookShareAPI(data) {
  return client
    .post("/api/v1/batch/social/generate/image", data)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function getScoutListAPI() {
  return client
    .get("/api/v1/scout/")
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function createNewScoutAPI(newScout) {
  //using the post url for create new scout
  // const url = "https://demo2044711.mockable.io/scout_post";

  // create id
  return client
    .post("/api/v1/scout/", {
      name: newScout
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function deleteScoutAPI(scoutId) {
  const url = "/api/v1/scout/?id=" + encodeURIComponent(scoutId);
  return client
    .delete(url)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function editScoutAPI(scoutId, newScoutName) {
  return client
    .put("/api/v1/scout/", {
      id: scoutId,
      name: newScoutName
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

export {
  searchAmazonProductsAPI,
  createNewBatchAPI,
  getBatchDataAPI,
  updateBatchDataAPI,
  deleteBatchAPI,
  getBatchListAPI,
  getBatchProductsFeedAPI,
  postProductsFeedToAmazonAPI,
  saveBatchItemAPI,
  updateBatchItemAPI,
  deleteBatchItemAPI,
  postPrivateBatchListingToAmazonAPI,
  postLiveBatchListingToAmazonAPI,
  approveShipmentCreationAPI,
  getPricingDataAPI,
  addToHoldingsAPI,
  getHoldingsAPI,
  updateItemQuantityOnAmazonAPI,
  deleteHoldingAreaListingAPI,
  createNewSupplierAPI,
  getSupplierListAPI,
  deleteSupplierAPI,
  editSupplierAPI,
  addBoxInfoForLiveBatchShipmentAPI,
  updateBoxInfoForLiveBatchShipmentAPI,
  createShipmentPlansAPI,
  getShipmentPlanCreationStatusAPI,
  createShipmentAPI,
  updateListingDefaultsDataAPI,
  completeBatchApi,
  bulkAddToHoldingAreaAPI,
  createHoldingAreaShipmentAPI,
  getAdditionalInformationOfShipmentItemsAPI,
  getBatchHistoryStatsAPI,
  funnyFacebookShareAPI,
  getScoutListAPI,
  createNewScoutAPI,
  deleteScoutAPI,
  editScoutAPI,
};
