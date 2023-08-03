
export const USER_LOGIN_API = 'login_api/'
export const USER_REGISTER_API = 'lawyer-register-api'
export const VERIFY_OTP_API = 'lawyer-client-otp-verification'
export const REGISTER_VERIFY_OTP_API = 'verify-lawyer-otp-api'
export const RESEND_OTP_API = 'lawyer-phone-number-verification-resend-otp'
export const GET_LAWYER_PROFILE_DETAILS_API = 'lawyer-current-profile-details'
export const GET_STATE = 'get-state'
export const GET_CITY = 'get-city'
export const GET_LOCALITY =(pinCode) => `find-location/${pinCode}`
export const UPDATE_LAWYER_PROFILE = 'lawyer-profile-api'
// export const GET_TALK_ZONE_DETAILS_API =(page , limitItem) => `lawyer-talk-zone-data-listing-api/1/10`
export const GET_TALK_ZONE_DETAILS_API =(page , limitItem) => `lawyer-talk-zone-data-listing-api/${page}/${limitItem}`
export const GET_TAKE_CALL_STATUS_API = 'lawyer-talk-service-details-view-api'
export const CHANGE_CALL_RECEIVE_AVAILABILITY_API = 'change-call-receive-availability-api'
// export const GET_SCHEDULE_CALL_LIST_API = 'api/v1/lawyer/lkc/schedule-call-list/1/10'
export const GET_SCHEDULE_CALL_LIST_API =(page) => `api/v1/lawyer/lkc/schedule-call-list/${page}/10`
export const VIEW_LAWYER_PROFILE_BY_TYPE_API = 'view-lawyer-profile-by-type'
export const GENERATE_PAYMENT_LINK_API = 'api/v1/lawyer/payment-link/create'
export const ADD_CUSTOM_RATE_API = 'api/v1/lawyer/add-custom-lkc-rate'
export const GET_CLIENT_DETAILS_API =(client_id) => `api/v1/lawyer/talk-zone-jc-lead/buy/${'app'}/${client_id}`
export const RESCHEDULE_CALL_API = 'api/v1/lawyer/lkc/accept-schedule-call'
// export const RESCHEDULE_CALL_API = 'api/v1/lawyer/lkc/accept-schedule-call'
