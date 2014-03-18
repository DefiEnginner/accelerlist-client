import {
    Map
} from 'immutable/dist/immutable'
import actions from './actions'

const initState = new Map({
  source: {},
  subscription: {},
  currentAlert: null,
  cardReplacementRequestStatus: null,
  is_canceled: false,
  is_restarted: false,
  is_canceling: false,
  is_restarting: false,
  show_cancel_failed: false,
  show_restart_failed: false,
  show_canceled: false,
  show_restarted: false,
  is_replacing_card: false,
  show_card_replaced: false,
  show_card_replace_failed: false,
})

export default function membershipReducer(state = initState, action) {
    switch (action.type) {
      case actions.FETCH_MEMBERSHIP_SUCCESS:
        return state
          .set('source', action.membership.source)
          .set('subscription', action.membership.subscription)

      case actions.CLOSE_MEMBERSHIP_ALERT:
        return state.set("currentAlert", null)

      case actions.SHOW_MEMBERSHIP_ALERT:
        return state.set("currentAlert", action.alert)

      case actions.SET_CARD_REPLACEMENT_REQUEST_STATUS:
        return state.set("cardReplacementRequestStatus", action.status)

      case actions.CANCEL_MEMBERSHIP:
			return state
				.set('is_canceling', true)
				.set('show_canceled', false)
				.set('show_restarted', false)
				.set('show_restart_failed', false)
				.set('show_cancel_failed', false);

      case actions.RESTART_MEMBERSHIP:
			return state
				.set('is_restarting', true)
				.set('show_canceled', false)
				.set('show_restarted', false)
				.set('show_cancel_failed', false)
				.set('show_restart_failed', false);

      case actions.CANCEL_MEMBERSHIP_SUCCESS:
			return state
				.set('is_canceled', true)
				.set('show_canceled', true)
				.set('is_canceling', false)
				.set('is_restarted', false);

      case actions.CANCEL_MEMBERSHIP_FAILED:
			return state
				.set('is_canceled', false)
				.set('is_canceling', false)
				.set('is_restarted', false)
				.set('is_restarting', false)
				.set('show_cancel_failed', true);

      case actions.RESTART_MEMBERSHIP_SUCCESS:
			return state
				.set('is_restarted', true)
				.set('show_restarted', true)
				.set('is_restarting', false)
				.set('is_canceled', false);

      case actions.RESTART_MEMBERSHIP_FAILED:
			return state
				.set('is_canceled', false)
				.set('is_canceling', false)
				.set('is_restarted', false)
				.set('is_restarting', false)
				.set('show_restart_failed', true);

      case actions.CARD_REPLACEMENT_MEMBERSHIP:
			return state
				.set('is_replacing_card', true)
				.set('show_card_replaced', false)
				.set('show_card_replace_failed', false)

      case actions.CARD_REPLACEMENT_MEMBERSHIP_SUCCESS:
			return state
				.set('is_replacing_card', false)
				.set('show_card_replaced', true)
				.set('show_card_replace_failed', false)

      case actions.CARD_REPLACEMENT_MEMBERSHIP_FAILED:
			return state
				.set('is_replacing_card', false)
				.set('show_card_replaced', false)
				.set('show_card_replace_failed', true)

      default:
        return state
    }
}
