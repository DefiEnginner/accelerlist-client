import { all, takeEvery, put, fork, call, select } from "redux-saga/effects";
import { logError } from "../../../helpers/utility";
import { getPricingDataAPI } from "../../../helpers/batch/apis";

import {
  getUsedOrNewPriceAccordingly,
  isValidBuyCost,
  calculateProfitMarginAndROIPrice,
  applyAdjustmentOnPrice,
  checkConditionIsUsedOrNew,
  getLowestFBAOffer
} from "../../../helpers/batch/utility";

import appActions from "../../app/actions";
import actions from "../actions";
import {
  batchIdSelector,
  batchListingDefaultsSelector,
  currentWorkingListingDataSelector
} from "../selector";

export function* getPricingData() {
  yield takeEvery(actions.GET_PRICING_DATA, function*(payload) {
    try {
      let data = {
        asin: payload.asin,
        channel: payload.channel
      };
      const response = yield call(getPricingDataAPI, data);
      if (response.data.error) {
        yield put(actions.getPricingDataFailure());
      } else {
        yield put(actions.getPricingDataSuccess(response.data));
      }
    } catch (err) {
      yield put(actions.getPricingDataFailure());
      logError(err, {
        tags: {
          exceptionType: actions.GET_PRICING_DATA_FAILURE,
          batchId: yield select(batchIdSelector),
        }
      });
    } finally {
      yield put(actions.applyAutoPricingRules());
    }
  });
}

const NO_BUY_BOX_PRICE_FOUND_AND_NO_BACKUP_PRICE_FOUND =
  "No matching buy box price found and no backup price provided. Skipping auto-price calculation.";
const NO_BUY_BOX_PRICE_FOUND_USING_BACKUP_PRICE =
  "Cannot find matching box price. Using to the backup price provided.";
const AUTO_PRICE_CONFIGURATION_INCOMPLETE =
  "Your auto-price rule configuration is incomplete. Please go back to the workflow tab to complete it. Skipping auto-pricing calculation for this listing."
const AUTO_PRICE_CONFIGURATION_INCOMPLETE_BUY_COST_INVALID =
  "Cannot auto-calculate price because buy cost is missing. Please set your DEFAULT buy cost on the sidebar, for the auto-price rule to take place for your next scanned item. Skipping auto-pricing calculation for this listing."
const FEES_DATA_UNAVAILABLE_USING_BACKUP_PRICE = "Fees data unavailable. Pricing using the backup price provided."
const FBA_OFFERS_UNAVAILABLE_USING_BACKUP_PRICE = "FBA offers unavailable. Pricing using the backup price provided."
const AUTO_PRICE_CONFIGURATION_INCOMPLETE_CONDITION_INVALID = "The condition was invalid (Please set it to New / Used conditions when competing against buy box). Skipping auto-pricing calculation for this listing."
const AUTO_PRICE_CONFIGURATION_INCOMPLETE_LIST_PRICE_RULE_TYPE_INVALID = "You must click either the $ or % buttons for the pricing settings on the workflow tab to fully define your settings. Skipping auto-pricing calculation for this listing."
const BUY_BOX_PRICES_UNAVAILABLE_USING_BACKUP_PRICE = "Cannot find used or new buy box price. Using to the backup price provided."
const INVALID_SUGGESTED_PRICE = "Suggested price from auto-price rules would result in a price less than zero. Skipping auto-pricing calculation for this listing."
const UNEXPECTED_ERROR = "Unexpected error occured with the auto-pricing rule. Skipped auto-pricing logic."
const NO_DEFAULT_PRICE_FOUND_SKIPPING_AUTOPRICE_CALCULATION = "No backup price was provided in the auto-price settings, so we're skipping the calculation."

export function* _applyAutoPricingRules(payload) {
  try {
    let adjustedPrice;
    const batchListingDefaults = yield select(batchListingDefaultsSelector);
    const currentWorkingListingData = yield select(
      currentWorkingListingDataSelector
    );
    if (batchListingDefaults.listPriceRuleType === "match_buy_box_price") {
      // Handling matching buy box price use case. We get the buy box price and then
      // if it's unavailable, we show an error and try to use backup price. If backup
      // price is also unavailable, then we show second error and emit price calculation error action.
      let suggestedPrice = getUsedOrNewPriceAccordingly(
        currentWorkingListingData,
        batchListingDefaults
      );

      adjustedPrice = suggestedPrice;
      if (!adjustedPrice || isNaN(adjustedPrice)) {
        adjustedPrice = suggestedPrice || batchListingDefaults.defaultListPrice;
        if (currentWorkingListingData.pricingData) {
          yield put(
            appActions.userError(NO_BUY_BOX_PRICE_FOUND_USING_BACKUP_PRICE)
          );
        }
        if (!adjustedPrice || isNaN(adjustedPrice)) {
          yield put(appActions.userError(NO_BUY_BOX_PRICE_FOUND_AND_NO_BACKUP_PRICE_FOUND));
          yield put(actions.updateCalculatedPriceError());
          return;
        }
      }
      // Got here? OK Then that means we didn't return on any calculation failures 
      // and we verified that we do indeed have a valid adjustedPrice to use.
      yield put(actions.updateCalculatedPrice(adjustedPrice));
    } else if (batchListingDefaults.listPriceRuleType === "price") {
      // Handling other auto-price cases. (roi, profit_margin, lower_than_buy_box, higher_than_buy_box)
      let suggestedPrice;
      if (
        (!batchListingDefaults.priceRuleDirection ||
        !batchListingDefaults.listPriceRuleAmount) &&
        batchListingDefaults.priceRuleDirection !== "lowest_fba_offer"
      ) {
        yield put(appActions.userError(AUTO_PRICE_CONFIGURATION_INCOMPLETE));
        yield put(actions.updateCalculatedPriceError());
        return;
      } else {
        if (
          ["roi", "profit_margin"].indexOf(
            batchListingDefaults.priceRuleDirection
          ) > -1
        ) {
          if (!isValidBuyCost(currentWorkingListingData.buyCost)) {
            yield put(appActions.userError(AUTO_PRICE_CONFIGURATION_INCOMPLETE_BUY_COST_INVALID));
            yield put(actions.updateCalculatedPriceError());
            return;
          } else if (!currentWorkingListingData.totalFeeEstimate) {
            yield put(appActions.userError(FEES_DATA_UNAVAILABLE_USING_BACKUP_PRICE));
            suggestedPrice = batchListingDefaults.defaultListPrice;
          } else {
            suggestedPrice = calculateProfitMarginAndROIPrice(
              batchListingDefaults,
              currentWorkingListingData
            );
          }
          } else if (
            ["higher_than_buy_box", "lower_than_buy_box"].indexOf(
              batchListingDefaults.priceRuleDirection
            ) > -1
          ) {
            // Check if the condition is valid
            let conditionIsUsedOrNew = checkConditionIsUsedOrNew(
              currentWorkingListingData.condition
            );
            if (!conditionIsUsedOrNew) {
              yield put(appActions.userError(AUTO_PRICE_CONFIGURATION_INCOMPLETE_CONDITION_INVALID));
              yield put(actions.updateCalculatedPriceError());
              return;
            } else if (!batchListingDefaults.listPriceRuleType) {
              yield put(appActions.userError(AUTO_PRICE_CONFIGURATION_INCOMPLETE_LIST_PRICE_RULE_TYPE_INVALID));
              yield put(actions.updateCalculatedPriceError());
              return;
            } else {
              let priceToApplyRulesAgainst = getUsedOrNewPriceAccordingly(currentWorkingListingData);
              if (!priceToApplyRulesAgainst) {
                yield put(appActions.userError(BUY_BOX_PRICES_UNAVAILABLE_USING_BACKUP_PRICE));
                suggestedPrice = batchListingDefaults.defaultListPrice;
              } else {
                let priceToApplyRulesAgainst = getUsedOrNewPriceAccordingly(
                  currentWorkingListingData
                );
                suggestedPrice = applyAdjustmentOnPrice(
                  batchListingDefaults,
                  priceToApplyRulesAgainst
                );
              }
            }
          } else if (
            ["higher_than_lowest_FBA_offer", "lower_than_lowest_FBA_offer"].indexOf(
              batchListingDefaults.priceRuleDirection
            ) > -1
          ) {
            const lowestFBAOffer = getLowestFBAOffer(currentWorkingListingData);
            if (lowestFBAOffer) {
              suggestedPrice = applyAdjustmentOnPrice(batchListingDefaults, lowestFBAOffer);
            } else {
              yield put(appActions.userError(FBA_OFFERS_UNAVAILABLE_USING_BACKUP_PRICE));
              suggestedPrice = batchListingDefaults.defaultListPrice;
            }
          }

        }
        adjustedPrice = suggestedPrice;
        // Check if it is adjusted price was an actual number that was greater than zero. If so, then we should
        // tell the user that no valid price could be found.
        if (!isNaN(adjustedPrice) && parseFloat(adjustedPrice) < 0) {
          yield put(appActions.userError(INVALID_SUGGESTED_PRICE));
          yield put(actions.updateCalculatedPriceError());
        } else if (String(adjustedPrice).trim() === "") {
          yield put(appActions.userError(NO_DEFAULT_PRICE_FOUND_SKIPPING_AUTOPRICE_CALCULATION));
          // If the adjusted price was empty, we should send an action 
          // so that the speed flow knows to show the pricing options.
          yield put(actions.updateCalculatedPriceError());
        } else if (isNaN(adjustedPrice) && String(adjustedPrice).trim() !== "") {
          yield put(appActions.userError(UNEXPECTED_ERROR));
          yield put(actions.updateCalculatedPriceError());
          return;
        } else {
          yield put(actions.updateCalculatedPrice(adjustedPrice));
        }
      } else if (batchListingDefaults.listPriceRuleType === "fixed_value") {
        // show error only if price is not set correctly.
        let fixedPrice = batchListingDefaults.price;
        if (!fixedPrice || isNaN(fixedPrice)) {
          yield put(actions.updateCalculatedPriceError());
        } else {
          yield put(actions.updateCalculatedPrice(fixedPrice));
        }
      } else if (batchListingDefaults.listPriceRuleType === "lowest_fba_offer") {
        const lowestFBAOffer = getLowestFBAOffer(currentWorkingListingData);
        if (lowestFBAOffer) {
          yield put(actions.updateCalculatedPrice(lowestFBAOffer));
        } else {
          yield put(appActions.userError(FBA_OFFERS_UNAVAILABLE_USING_BACKUP_PRICE));
          yield put(actions.updateCalculatedPrice(batchListingDefaults.defaultListPrice));
        }
    } else {
      // either batchListingDefaults.listPriceRuleType == own-value or it is unexpected.
      // either is a good reason to emit a price calculation error.
      yield put(actions.updateCalculatedPriceError());
    }
  } catch (err) {
    yield put(actions.updateCalculatedPriceError());
    yield put(
      appActions.apiCallFailed("Error! Unable to apply auto-pricing rules")
    );
    logError(err, {
      tags: {
        exceptionType: actions.UPDATE_CALCULATED_PRICE_ERROR,
        batchId: yield select(batchIdSelector),
      }
    });
  }
}

export function* applyAutoPricingRules() {
  yield takeEvery(actions.APPLY_AUTO_PRICING_RULES, _applyAutoPricingRules);
}

export default function* rootSaga() {
  yield all([
    fork(getPricingData),
    fork(applyAutoPricingRules),
  ]);
}
