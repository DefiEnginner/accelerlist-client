import { select } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import { _selectProductSearchResultAndInitializeCurrentWorkingListing } from "./saga";
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
  pricingData,
  searchResult,
  existingProducts,
} from "../test_fixtures";

const channel = "AMAZON_NA";

const provideSpeedModeData = expectObj => {
  return expectObj.provide([
    [matchers.call.fn(getPricingDataAPI), pricingData],
    [select(batchListingDefaultsSelector), batchListingDefaults],
    [select(currentWorkingListingDataSelector), currentWorkingListingData],
    [
      select(batchMetadataSelector),
      {
        channel
      }
    ]
  ]);
};

it("Show duplicate modal if asin matches", () => {
  return provideSpeedModeData(
    expectSaga(
      _selectProductSearchResultAndInitializeCurrentWorkingListing,
      actions.selectProductSearchResultAndInitializeListing(
        searchResult,
        channel,
        existingProducts,
      )
    )
  )
    .dispatch(actions.updateCalculatedPrice(5))
    .put(actions.updateModalDisplay("duplicate_asin_warning"))
    .run(false);
});

it("Try adding item to batch if item doesn't exist", () => {
  return provideSpeedModeData(
    expectSaga(
      _selectProductSearchResultAndInitializeCurrentWorkingListing,
      actions.selectProductSearchResultAndInitializeListing(
        searchResult,
        channel,
        [],
      )
    )
  )
    .dispatch(actions.updateCalculatedPrice(5))
    .put(actions.tryAddingItemToBatch(null, false))
    .run(false);
});
