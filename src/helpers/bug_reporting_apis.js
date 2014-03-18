import { client } from "./apiConfig";

function postBugReportAPI(data) {
  return client
    .post("/api/v1/bug/", data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

export { postBugReportAPI };
