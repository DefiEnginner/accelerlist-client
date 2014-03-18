import { client } from "./apiConfig";

function getListingDefaults() {
  return client
    .get("/api/v1/settings/listing_defaults")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function saveListingDefaults(data) {
  const reqBody = {
    updatedData: {
      ...data
    }
  };
  console.log("BODY: ", reqBody)
  return client
    .put("/api/v1/settings/listing_defaults", reqBody)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getPrinterDefaults() {
  return client
    .get("/api/v1/settings/printer_settings")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function savePrinterDefaults(data) {
  const reqBody = {
    ...data
  };
  return client
    .put("/api/v1/settings/printer_settings", reqBody)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateUserPassword(reqBody) {
  return client
    .post("/api/v1/user/password", reqBody)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}


function bUplaodProfileImage(file) {
  return client
		.put("/api/v1/user/image", file)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function addUserTagAPI(tags) {
  const body = {
	  'custom_sku_tags': tags}
  return client
    .put("/api/v1/user/settings", body)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}


function bGetProfileImage() {
  return client
	.get("/api/v1/user/image")
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function bGetProfileBillingDataAPI() {
  return client
	.get("/api/v1/user/billing")
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function getUserTagAPI() {
  return client
    .get("/api/v1/user/settings")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateUserDataAPI(data) {
  return client
    .put("/api/v1/user/", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateUserSettingsAPI(settings) {
  return client
    .put("/api/v1/user/settings", settings)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

export {
  getListingDefaults,
  saveListingDefaults,
  getPrinterDefaults,
  savePrinterDefaults,
  updateUserPassword,
  bUplaodProfileImage,
  bGetProfileImage,
  bGetProfileBillingDataAPI,
  addUserTagAPI,
  getUserTagAPI,
  updateUserDataAPI,
  updateUserSettingsAPI,
};
