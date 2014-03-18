import { client } from "./apiConfig";
import { momentDateIsValid } from "./utility";

function getAggregateDataAPI(startRange, endRange) {
  let requesURL = "/api/v1/admin/aggregate_data";
  if (startRange
    && endRange
    && momentDateIsValid(startRange)
    && momentDateIsValid(endRange)) {
      requesURL = `${requesURL}?minTimestamp=${startRange}&maxTimestamp=${endRange}`
    }
  return client
    .get(requesURL)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

export { getAggregateDataAPI };
