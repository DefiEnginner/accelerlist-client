import { client } from "./apiConfig";

function getMembershipAPI() {
  return client
    .get("/api/v1/membership/")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateMembershipBillingAPI(data) {
  return client
    .post("/api/v1/membership/billing", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function restartMembershipAPI() {
  return client
    .post("/api/v1/membership")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function cancelMembershipAPI() {
  return client
    .delete("/api/v1/membership")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function cardReplacementMembershipAPI(data){
  return client
    .post("/api/v1/membership/billing", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}


export {
	getMembershipAPI,
	updateMembershipBillingAPI,
	restartMembershipAPI,
	cancelMembershipAPI,
	cardReplacementMembershipAPI,
};
