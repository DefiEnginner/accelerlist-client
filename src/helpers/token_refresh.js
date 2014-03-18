import { clearToken } from "./utility";

let lastRefreshRequest = null;

export const refreshTokenInternalAPI = clientRef => {
  if (lastRefreshRequest) {
    return lastRefreshRequest;
  }
  lastRefreshRequest = clientRef
    .post("auth/refresh", null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refresh_token")}`
      }
    })
    .then(response => {
      lastRefreshRequest = null;
      clientRef.defaults.headers.common["Authorization"] = `Bearer ${
        response.data.access_token
      }`;
      localStorage.setItem("access_token", response.data.access_token);
      return response.data;
    })
    .catch(error => {
      clearToken();
      window.location.assign("/signin");
      return Promise.reject(error);
    });
  return lastRefreshRequest;
};

export const createAxiosResponseInterceptorForClient = client => {
  const interceptorCreator = () => {
    const interceptor = client.interceptors.response.use(
      response => response,
      error => {
        // Reject promise if usual error
        if (!error.response || error.response.status !== 401) {
          return Promise.reject(error);
        }
  
        /*
         * When response code is 401, try to refresh the token.
         * Eject the interceptor so it doesn't loop in case
         * token refresh causes the 401 response
         */
        client.interceptors.response.eject(interceptor);
  
        return refreshTokenInternalAPI(client)
          .then(response => {
            const config = Object.assign({}, error.response.config);
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${response.access_token}`
            };
            return client(config);
          })
          .finally(interceptorCreator);
      }
    );
  }
  return interceptorCreator;
};
