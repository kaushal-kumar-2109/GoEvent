import APIS from "./apis_utils/apis"
import FetchDataCall from "./apis_utils/requester"

const GET_LANDING_EVENTS = async (data) => {
    const url = APIS.GET_API.GET_LANDING_EVENTS;
    const response = await FetchDataCall(url, "GET", false);
    return response;
}

const GET_USER_DATA = async (data) => {
    const url = APIS.POST_API.GET_USER;
    const response = await FetchDataCall(url, "POST", false);
    return response;
}

const SEND_OTP = async (data) => {
    const url = APIS.POST_API.SEND_OTP;
    const response = await FetchDataCall(url, "POST", data);
    return response;
}

const SIGN_UP = async (data) => {
    const url = APIS.POST_API.SIGN_UP;
    const response = await FetchDataCall(url, "POST", data);
    return response;
}

export { GET_LANDING_EVENTS, GET_USER_DATA, SEND_OTP, SIGN_UP }