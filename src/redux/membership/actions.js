const membershipActions = {

    FETCH_MEMBERSHIP: 'FETCH_MEMBERSHIP',
    FETCH_MEMBERSHIP_SUCCESS: 'FETCH_MEMBERSHIP_SUCCESS',

    UPDATE_MEMBERSHIP_BILLING: 'UPDATE_MEMBERSHIP_BILLING',
    UPDATE_MEMBERSHIP_BILLING_SUCCESS: "UPDATE_MEMBERSHIP_BILLING_SUCCESS",
    UPDATE_MEMBERSHIP_BILLING_FAILURE: "UPDATE_MEMBERSHIP_BILLING_FAILURE",

    CLOSE_MEMBERSHIP_ALERT: 'CLOSE_MEMBERSHIP_ALERT',
    SHOW_MEMBERSHIP_ALERT: 'SHOW_MEMBERSHIP_ALERT',

    SET_CARD_REPLACEMENT_REQUEST_STATUS: 'SET_CARD_REPLACEMENT_REQUEST_STATUS',

	CANCEL_MEMBERSHIP: 'CANCEL_MEMBERSHIP',
	CANCEL_MEMBERSHIP_SUCCESS: 'CANCEL_MEMBERSHIP_SUCCESS',
	CANCEL_MEMBERSHIP_FAILED: 'CANCEL_MEMBERSHIP_FAILED',

	RESTART_MEMBERSHIP: 'RESTART_MEMBERSHIP',
	RESTART_MEMBERSHIP_SUCCESS: 'RESTART_MEMBERSHIP_SUCCESS',
	RESTART_MEMBERSHIP_FAILED: 'RESTART_MEMBERSHIP_FAILED',

	CARD_REPLACEMENT_MEMBERSHIP: 'CARD_REPLACEMENT_MEMBERSHIP',
	CARD_REPLACEMENT_MEMBERSHIP_SUCCESS: 'CARD_REPLACEMENT_MEMBERSHIP_SUCCESS',
	CARD_REPLACEMENT_MEMBERSHIP_FAILED: 'CARD_REPLACEMENT_MEMBERSHIP_FAILED',

    cardReplacementMembership: (data) => ({
      type: membershipActions.CARD_REPLACEMENT_MEMBERSHIP,
	  data
    }),
    cardReplacementMembershipSuccess: () => ({
      type: membershipActions.CARD_REPLACEMENT_MEMBERSHIP_SUCCESS,
    }),
    cardReplacementMembershipFailed: (error) => ({
		type: membershipActions.CARD_REPLACEMENT_MEMBERSHIP_FAILED,
		error
    }),

    restartMembership: () => ({
      type: membershipActions.RESTART_MEMBERSHIP,
    }),
    restartMembershipSuccess: () => ({
      type: membershipActions.RESTART_MEMBERSHIP_SUCCESS,
    }),
    restartMembershipFailed: (error) => ({
		type: membershipActions.RESTART_MEMBERSHIP_FAILED,
		error
    }),

    cancelMembership: () => ({
      type: membershipActions.CANCEL_MEMBERSHIP,
    }),
    cancelMembershipSuccess: () => ({
      type: membershipActions.CANCEL_MEMBERSHIP_SUCCESS,
    }),
    cancelMembershipFailed: (error) => ({
		type: membershipActions.CANCEL_MEMBERSHIP_FAILED,
		error
    }),

    fetchMembership: () => ({
      type: membershipActions.FETCH_MEMBERSHIP,
    }),
    fetchMembershipSuccess: membership => ({
      type: membershipActions.FETCH_MEMBERSHIP_SUCCESS,
      membership
    }),
    updateMembershipBilling: newMembershipBilling => ({
      type: membershipActions.UPDATE_MEMBERSHIP_BILLING,
      newMembershipBilling
    }),
    updateMembershipBillingSuccess: (successMessage) => ({
      type: membershipActions.UPDATE_MEMBERSHIP_BILLING_SUCCESS,
      successMessage
    }),
    updateMembershipBillingFailure: failureMessage => ({
      type: membershipActions.UPDATE_MEMBERSHIP_BILLING_FAILURE,
      failureMessage
    }),
    closeMembershipAlert: () => ({
      type: membershipActions.CLOSE_MEMBERSHIP_ALERT,
    }),
    showMembershipAlert: alert => ({
      type: membershipActions.SHOW_MEMBERSHIP_ALERT,
      alert
    }),
    setCardReplacementRequestToExecution: () => ({
      type: membershipActions.SET_CARD_REPLACEMENT_REQUEST_STATUS,
      status: "execution"
    }),
    setCardReplacementRequestToComplete: () => ({
      type: membershipActions.SET_CARD_REPLACEMENT_REQUEST_STATUS,
      status: "complete"
    }),
    resetCardReplacementRequestStatus: () => ({
      type: membershipActions.SET_CARD_REPLACEMENT_REQUEST_STATUS,
      status: null
    }),
}

export default membershipActions

