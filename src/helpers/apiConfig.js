import axios from "axios";
import defaults from "superagent-defaults";
import { getToken } from "./utility";
import { createAxiosResponseInterceptorForClient } from './token_refresh';

// const apiVersion = 'v1';
let backendHost;
let stripeAPIKey = "test_key"; //Stripe key for env other than production
const hostname = window && window.location && window.location.hostname;

let protocol = window.location.protocol;
let NODE_ENV = process.env.REACT_APP_NODE_ENV || "production";

if (NODE_ENV === "production") {
  backendHost = `${protocol}//accelerlist-backend.herokuapp.com`;
  stripeAPIKey = "pk_live_X7oiEfIKSOgrcFxqldQ5aOY6";
  // stripeAPIKey = "pk_test_yM5H8yrzg8dzukLn4ypJI44J";
} else if (NODE_ENV === "staging") {
  backendHost = `${protocol}//accelerlist-backend-staging.herokuapp.com`;
} else if (/^qa/.test(hostname)) {
  backendHost = `https://api.${hostname}`;
} else if (NODE_ENV === "development") {
  backendHost = `${protocol}//localhost:8080`;
} else {
  backendHost =
    protocol + (process.env.REACT_APP_API_URL || "//localhost:8080");
}

const API_ROOT = backendHost;

const client = axios.create({
  baseURL: API_ROOT
});

const superagent = defaults();

const request = {
  init: () =>
    superagent.set("Authorization", `Bearer ${getToken().toJS().access_token}`),
  delete: url => request.init().delete(url),
  get: url => request.init().get(url),
  post: url => request.init().post(url),
  put: url => request.init().put(url)
};

client.defaults.headers.common["Authorization"] = `Bearer ${
  localStorage.getItem("access_token")
}`;

const interceptor = createAxiosResponseInterceptorForClient(client);

interceptor();

export { request, backendHost, client, stripeAPIKey };
