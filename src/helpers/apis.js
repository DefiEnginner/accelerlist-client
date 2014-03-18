import { client } from "./apiConfig";
import { refreshTokenInternalAPI } from "./token_refresh";

function loginAPI(authData) {
  return client
    .post("/auth/login", authData)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function adminLoginAPI(authData) {
  return client
    .post("/auth/admin_login", authData)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function logoutAPI() {
  return client
    .delete("/sessions")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function signupAPI(userData) {
  return client
    .post("auth/registration", userData)
    .then(response => {
      console.log("response", response);
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function refreshTokenAPI() {
  return refreshTokenInternalAPI(client).catch(err => {
    throw err;
  });
}

function getUserAPI() {
  return client
    .get("api/v1/user/")
    .then(response => {
      console.log("response", response);
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function getUserInternationalizationConfigAPI() {
  return client
    .get("api/v1/user/internationalization_config")
    .then(response => {
      console.log("response", response);
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function verifyCredentialAPI(credentialData) {
  return client
    .post("/api/v1/user/credentials", credentialData)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function requestPassswordResetApi(emailOrMobile) {
  const isEmail = emailOrMobile.indexOf("@") > -1;
  let payload = {
    method: 'sms'
  };
  if (isEmail) {
    payload = {
      method: 'email',
      email: emailOrMobile
    }
  } else {
    payload.phone_number = emailOrMobile
  }

  return client
    .post("/auth/generate_reset_token", payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function updatePassswordApi(payload) {
  return client
    .post("/auth/reset_password", payload)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function getSavedAddresses() {
  return client
    .get("/api/v1/address/")
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function createAddress(addressData) {
  return client
    .post("/api/v1/address/", addressData)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function deleteAddress(id) {
  return client
    .delete("/api/v1/address/", {
      data: {
        addressId: id
      }
    })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function getSavedConditionNotes() {
  return client
    .get("/api/v1/condition_notes/")
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function saveConditionNote(payload) {
  let promise = null;
  if (!payload.id) {
    promise = client.post("/api/v1/condition_notes/", payload);
  } else {
    promise = client.put("/api/v1/condition_notes/", payload);
  }
  return promise
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function deleteConditionNote(id) {
  return client
    .delete("/api/v1/condition_notes/", {
      data: {
        noteId: id
      }
    })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function reorderConditionNote(updatedConditionNotes) {
  return client
    .post("/api/v1/condition_notes/reorder", { notes: updatedConditionNotes })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function bFrontItemListedCountAPI() {
	/**
	 * front items list count
	 */
  return client
	.get("/api/v1/accelerlist_frontapp_data/front_item_listed_count")
    .then(response => {
      return response.data;
    })
    .catch(err => {
      throw err;
    });
}

function adminReseUserPasswordAPI(data) {
  return client
		.post("api/v1/admin/password", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function adminSearchUserAPI(data) {
  return client
	.post("api/v1/admin/search/user", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function adminSearchUserUsersPerMarketplaceAPI() {
  return client
	.get("api/v1/admin/serach/user/marketplaces")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function adminSearchUserUsersErrorLogsAPI() {
  return client
	.get("api/v1/admin/search/user/errorlogs")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function adminUserChangeTokenAPI(data) {
  return client
	.post("api/v1/admin/user/clearauthtoken", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function adminBatchStatsAPI(data) {
  return client
	.get("api/v1/admin/batch/stats")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getLeaderboardAPI() {
  return client
		.get("api/v1/user/leaderboard")
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

export {
  loginAPI,
  adminLoginAPI,
  logoutAPI,
  signupAPI,
  getUserAPI,
  getUserInternationalizationConfigAPI,
  refreshTokenAPI,
  verifyCredentialAPI,
  requestPassswordResetApi,
  updatePassswordApi,
  getSavedAddresses,
  createAddress,
  deleteAddress,
  getSavedConditionNotes,
  saveConditionNote,
  deleteConditionNote,
  reorderConditionNote,
  bFrontItemListedCountAPI,
  adminReseUserPasswordAPI,
  adminSearchUserAPI,
  adminSearchUserUsersPerMarketplaceAPI,
  adminSearchUserUsersErrorLogsAPI,
  adminUserChangeTokenAPI,
  adminBatchStatsAPI,
  getLeaderboardAPI,
};
