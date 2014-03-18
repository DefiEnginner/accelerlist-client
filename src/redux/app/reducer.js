import { Map } from 'immutable'
import actions from './actions'

const initState = new Map({
  apiCallSuccess: false,
  apiCallError: false,
  apiCallUserError: false,
  apiCallUserWarning: false,
  apiCallUserSuccess: false,
  apiCallUserSoundNotificationSuccess: false,
  apiErrorMessage: '',
  apiSuccessMessage: '',
  userErrorMessage: '',
  userSuccessMessage: '',
  userWarningMessage: '',
})

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.API_CALL_SUCCESS:
      return state
        .set('apiCallError', false)
        .set('apiCallSuccess', true)
        .set('apiSuccessMessage', action.successMessage)

    case actions.API_CALL_FAILED:
      return state
        .set('apiCallSuccess', false)
        .set('apiCallError', true)
        .set('apiErrorMessage', action.errorMessage)

    case actions.API_CALL_USER_ERROR:
      return state
        .set('apiCallUserError', true)
        .set('userErrorMessage', action.userErrorMessage)

    case actions.API_CALL_USER_WARNING:
      return state
        .set('apiCallUserMessage', true)
        .set('userWarningMessage', action.userWarningMessage)

    case actions.API_CALL_USER_SUCCESS:
      return state
        .set('apiCallUserSuccess', true)
        .set('userSuccessMessage', action.userSuccessMessage)

    case actions.API_CALL_USER_SOUND_NOTIFICATION_SUCCESS:
      return state
        .set('apiCallUserSoundNotificationSuccess', true)

    case actions.RESET_API_CALL_STATUS:
      return state.merge(initState)

    default:
      return state
  }
}