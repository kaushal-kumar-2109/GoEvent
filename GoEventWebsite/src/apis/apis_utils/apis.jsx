const MAIN_URL = import.meta.env.VITE_BACKEND_WEB_API_1 || import.meta.env.VITE_BACKEND_WEB_API_2;
const SUB_URL = import.meta.env.VITE_BACKEND_WEB_SUB_API;

const APIS = {
    GET_API: {
        GET_LANDING_EVENTS: `${MAIN_URL}${SUB_URL}/gets/get-landing-events`,
        GET_USER: `${MAIN_URL}${SUB_URL}/gets/get-user`,
        GET_EVENTS: `${MAIN_URL}${SUB_URL}/gets/get-events`,
        GET_EVENT_DETAILS: `${MAIN_URL}${SUB_URL}/gets/get-event-details`,
        GET_USER_LOG_OUT: `${MAIN_URL}${SUB_URL}/gets/user-log-out`,
        GET_ORGANIZER_EVENTS: `${MAIN_URL}${SUB_URL}/gets/get-organizer-events`,
        GET_ORGANIZER_EVENT_DETAILS: `${MAIN_URL}${SUB_URL}/gets/get-organizer-event-details`,
    },
    POST_API: {
        SEND_OTP: `${MAIN_URL}${SUB_URL}/posts/send-otp`,
        SIGN_UP: `${MAIN_URL}${SUB_URL}/posts/register-user`,
        LOG_IN: `${MAIN_URL}${SUB_URL}/posts/user-login`,
        CREATE_EVENT: `${MAIN_URL}${SUB_URL}/posts/create-event`,
        UPLOAD_IMAGE: `${MAIN_URL}${SUB_URL}/posts/upload-image`,
    },
    PUT_API: {
        UPDATE_EVENT: `${MAIN_URL}${SUB_URL}/puts/update-event`,
    },
    DELETE_API: {
        DELETE_EVENT: `${MAIN_URL}${SUB_URL}/deletes/delete-event`,
    },
}

export default APIS
