import { select } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import { _applyAutoPricingRules } from "./saga";
import actions from "../actions";
import {
  batchListingDefaultsSelector,
  batchMetadataSelector,
  currentWorkingListingDataSelector
} from "../selector";
import { getPricingDataAPI } from "../../../helpers/batch/apis";
import * as matchers from "redux-saga-test-plan/matchers";
import {
  batchListingDefaults,
  currentWorkingListingData,
  pricingData
} from "../test_fixtures";

const channel = "AMAZON_NA";

const modifyWorkListingData = (
  currentWorkingListingData,
  withEmptyPricingData
) => {
  if (withEmptyPricingData) {
    return {
      ...currentWorkingListingData,
      pricingData: null
    };
  }
  return currentWorkingListingData;
};

const providePricingData = (expectObj, withEmptyPricingData) => {
  return expectObj.provide([
    [matchers.call.fn(getPricingDataAPI), pricingData],
    [select(batchListingDefaultsSelector), batchListingDefaults],
    [
      select(currentWorkingListingDataSelector),
      modifyWorkListingData(currentWorkingListingData, withEmptyPricingData)
    ],
    [
      select(batchMetadataSelector),
      {
        channel
      }
    ]
  ]);
};

it("Verify price calculation using buy box price with pricing data", () => {
  return providePricingData(expectSaga(_applyAutoPricingRules))
    .put(actions.updateCalculatedPrice(7.25))
    .run(false);
});

it("Verify price calculation using buy box price with backup", () => {
  return providePricingData(expectSaga(_applyAutoPricingRules), true)
    .put(actions.updateCalculatedPrice(12))
    .run(false);
});
