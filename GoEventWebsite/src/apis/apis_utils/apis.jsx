const MAIN_URL = import.meta.env.VITE_BACKEND_WEB_API;
const SUB_URL = import.meta.env.VITE_BACKEND_WEB_SUB_API;

const APIS = {
    GET_API: {
        GET_LANDING_EVENTS: `${MAIN_URL}${SUB_URL}/gets/get-landing-events`,
        GET_USER: `${MAIN_URL}${SUB_URL}/gets/get-user`,
        GET_EVENTS: `${MAIN_URL}${SUB_URL}/gets/get-events`,
        GET_EVENT_DETAILS: `${MAIN_URL}${SUB_URL}/gets/get-event-details`,
        GET_USER_LOG_OUT: `${MAIN_URL}${SUB_URL}/gets/user-log-out`,
    },
    POST_API: {
        SEND_OTP: `${MAIN_URL}${SUB_URL}/posts/send-otp`,
        SIGN_UP: `${MAIN_URL}${SUB_URL}/posts/register-user`,
        LOG_IN: `${MAIN_URL}${SUB_URL}/posts/user-login`
    },
    PUT_API: {},
    DELETE_API: {},
}

export default APIS
