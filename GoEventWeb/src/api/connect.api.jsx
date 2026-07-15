const WEB_PATH = import.meta.env.VITE_BACKEND_WEB_API;
const MAIN_SUB_WEB_URL = "/GoEvent";

const ROUTERS = {
    POST_ROUTE: {
        sendOtp: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/send-otp`,
        createUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/create-user`,
        setUser: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/set-user`,
        createEvent: `${WEB_PATH}${MAIN_SUB_WEB_URL}/post/create-event`
    },
    GET_ROUTE: {
        getLandEvent: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-land-events`,
        getEvent: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-event`,
        getEvents: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-events`,
        getUserProfileData: `${WEB_PATH}${MAIN_SUB_WEB_URL}/get/get-user-profile-data`
    },
    PUT_ROUTE: {
        updatePassword: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/change-password`,
        updateEventData: `${WEB_PATH}${MAIN_SUB_WEB_URL}/put/update-event`
    }
};

export default ROUTERS;