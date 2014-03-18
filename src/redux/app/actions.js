const appActions = {
  API_CALL_SUCCESS: "API_CALL_SUCCESS",
  API_CALL_FAILED: "API_CALL_FAILED",
  API_CALL_USER_ERROR: "API_CALL_USER_ERROR",
  API_CALL_USER_WARNING: "API_CALL_USER_WARNING",

  API_CALL_USER_SUCCESS: "API_CALL_USER_SUCCESS",
  API_CALL_USER_SOUND_NOTIFICATION_SUCCESS: "API_CALL_USER_SOUND_NOTIFICATION_SUCCESS",
  RESET_API_CALL_STATUS: "RESET_API_CALL_STATUS",

  userError: (errorMessage) => ({
    type: appActions.API_CALL_FAILED,
    errorMessage
  }),

  apiCallFailed: (errorMessage) => ({
    type: appActions.API_CALL_FAILED,
    errorMessage
  }),
  apiCallSuccess: (successMessage) => ({
    type: appActions.API_CALL_SUCCESS,
    successMessage
  }),
  apiCallUserError: (userErrorMessage) => ({
    type: appActions.API_CALL_USER_ERROR,
    userErrorMessage
  }),
  apiCallUserWarning: (userWarningMessage) => ({
    type: appActions.API_CALL_USER_WARNING,
    userWarningMessage
  }),
  confirWarningModal: () => ({
    type: appActions.CONFIRM_WARNING_MODAL
  }),
  apiCallUserSuccess: (userSuccessMessage) => ({
    type: appActions.API_CALL_USER_SUCCESS,
    userSuccessMessage
  }),
  apiCallUserSoundNotificationSuccess: () => ({
    type: appActions.API_CALL_USER_SOUND_NOTIFICATION_SUCCESS
  }),
  resetApiCallStatus: () => ({
    type: appActions.RESET_API_CALL_STATUS
  })
}

export default appActions