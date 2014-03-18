import { all } from "redux-saga/effects"
import authSagas from "./auth/saga"
import addressSagas from "./address/saga"
import historySagas from "./history/saga"
import conditionSagas from "./condition_notes/saga"
import settingsSagas from "./settings/saga"
import boxContentsSagas from "./box_contents/saga"
import inventorySagas from "./inventory/saga"
import MembershipSagas from "./membership/saga"
import BugReportingSagas from "./bug_reporting/saga"
import StatsSagas from './stats/saga'
import DashboardSagas from './main_dashboard/saga'
import AccountingSagas from './accounting/saga'
import LandingSagas from './landing/saga'
import userTagsSagas from './settings/user_tags/saga'
import adminSagas from './admin/saga'
import holdingAreaSagas from './holding_area/saga'
import leaderboardSagas from './leaderboard/saga'

//import batchSagas from "./batch/saga"
import batchShipmentSagas from './batch/shipments/saga'
import privateBatchSagas from './batch/private_batch/saga'
import liveBatchSagas from './batch/live_batch/saga'
import batchPricingSagas from './batch/pricing/saga'
import batchListingSagas from './batch/listing/saga'
import batchHoldingAreaSagas from './batch/holding_area/saga'
import batchFeedsSagas from './batch/feeds/saga'
import batchManagementSagas from './batch/batch_management/saga'
import batchListingDefaultsSagas from './batch/batch_listing_defaults/saga'


export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    addressSagas(),
    historySagas(),
    conditionSagas(),
    settingsSagas(),
    boxContentsSagas(),
    inventorySagas(),
    MembershipSagas(),
    BugReportingSagas(),
    StatsSagas(),
    batchShipmentSagas(),
    privateBatchSagas(),
    liveBatchSagas(),
    batchPricingSagas(),
    batchListingSagas(),
    batchHoldingAreaSagas(),
    batchFeedsSagas(),
    batchManagementSagas(),
    batchListingDefaultsSagas(),
    DashboardSagas(),
	AccountingSagas(),
	LandingSagas(),
	userTagsSagas(),
	adminSagas(),
	  holdingAreaSagas(),
	  leaderboardSagas(),
  ])
}
