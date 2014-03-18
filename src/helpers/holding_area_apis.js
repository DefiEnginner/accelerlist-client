import { client } from "./apiConfig";

function getAllHoldingAreaListings() {
  return client
    .get("/holding_area/")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function createNewHoldingAreaListing(data) {
  return client
    .post("/holding_area/", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function deleteHoldingAreaListing(data) {
  return client
    .delete("/holding_area/", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function deleteHoldingAreaListingsInBulk(data) {
  return client
	.post("api/v1/holding_area/bulk/delete", data )
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

export {
  getAllHoldingAreaListings,
  createNewHoldingAreaListing,
  deleteHoldingAreaListing,
  deleteHoldingAreaListingsInBulk,
};
