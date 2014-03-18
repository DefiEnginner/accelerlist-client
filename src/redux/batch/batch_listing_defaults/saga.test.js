import { select } from "redux-saga/effects";
import { expectSaga } from "redux-saga-test-plan";
import { _updateListingDefaultsDatafunction } from "./saga";
import actions from "../actions";
import {
  batchListingDefaultsSelector,
  batchMetadataSelector
} from "../selector";
import { updateListingDefaultsDataAPI } from "../../../helpers/batch/apis";
import * as matchers from "redux-saga-test-plan/matchers";

const fakeBatchId = "test";

const provideUpdateListingDefaultsData = expectObj => {
  return expectObj.provide([
    [matchers.call.fn(updateListingDefaultsDataAPI), { error: null }],
    [
      select(batchMetadataSelector),
      {
        id: fakeBatchId
      }
    ],
    [
      select(batchListingDefaultsSelector),
      {
        gradingOptions: false,
        pricingOptions: false
      }
    ]
  ]);
};

it("Grading options is turned ON when condition is set to NoDefault", () => {
  const fieldName = "condition";
  const fieldValue = "NoDefault";

  return provideUpdateListingDefaultsData(
    expectSaga(
      _updateListingDefaultsDatafunction,
      actions.updateListingDefaultsData(fieldName, fieldValue)
    )
  )
    .put(actions.updateListingDefaultsData("gradingOptions", true))
    .run(false);
});

it("Grading options is turned ON when condition is cleared", () => {
  const fieldName = "condition";
  const fieldValue = "";

  return provideUpdateListingDefaultsData(
    expectSaga(
      _updateListingDefaultsDatafunction,
      actions.updateListingDefaultsData(fieldName, fieldValue)
    )
  )
    .put(actions.updateListingDefaultsData("gradingOptions", true))
    .run(false);
});

it("Pricing options is turned ON when pricing rule is set to own-price", () => {
  const fieldName = "listPriceRuleType";
  const fieldValue = "own-price";

  return provideUpdateListingDefaultsData(
    expectSaga(
      _updateListingDefaultsDatafunction,
      actions.updateListingDefaultsData(fieldName, fieldValue)
    )
  )
    .put(actions.updateListingDefaultsData("pricingOptions", true))
    .run(false);
});

it("Pricing options is turned ON when pricing rule is cleared", () => {
  const fieldName = "listPriceRuleType";
  const fieldValue = "";

  return provideUpdateListingDefaultsData(
    expectSaga(
      _updateListingDefaultsDatafunction,
      actions.updateListingDefaultsData(fieldName, fieldValue)
    )
  )
    .put(actions.updateListingDefaultsData("pricingOptions", true))
    .run(false);
});
