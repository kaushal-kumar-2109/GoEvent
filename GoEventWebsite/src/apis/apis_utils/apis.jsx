const MAIN_URL = import.meta.env.VITE_BACKEND_WEB_API;
const SUB_URL = import.meta.env.VITE_BACKEND_WEB_SUB_API;

const APIS = {
    GET_API: {
        GET_LANDING_EVENTS: `${MAIN_URL}${SUB_URL}/gets/get-landing-events`
    },
    POST_API: {
        GET_USER: `${MAIN_URL}${SUB_URL}/posts/get-user`,
        SEND_OTP: `${MAIN_URL}${SUB_URL}/posts/send-otp`,
        SIGN_UP: `${MAIN_URL}${SUB_URL}/posts/register-user`
    },
    PUT_API: {},
    DELETE_API: {},
}

export default APIS
