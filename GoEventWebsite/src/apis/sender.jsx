import APIS from "./apis_utils/apis"
import FetchDataCall from "./apis_utils/requester"

const GET_LANDING_EVENTS = async () => {
    const url = APIS.GET_API.GET_LANDING_EVENTS;
    const response = await FetchDataCall(url, "GET", false);
    return response;
}

const GET_USER_DATA = async () => {
    const url = APIS.GET_API.GET_USER;
    const response = await FetchDataCall(url, "GET", false);
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

const LOGIN_IN = async (data) => {
    const url = APIS.POST_API.LOG_IN;
    const response = await FetchDataCall(url, "POST", data);
    return response;
}

const GET_EVENTS = async (params) => {
    let url = APIS.GET_API.GET_EVENTS;
    if (params) {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
                queryParams.append(key, val);
            }
        });
        const queryString = queryParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }
    const response = await FetchDataCall(url, "GET", false);
    return response;
}

const GET_EVENT_DETAILS = async (body) => {
    const url = APIS.GET_API.GET_EVENT_DETAILS + "/" + body?.eid;
    const response = await FetchDataCall(url, "GET", false);
    return response;
}

const GET_USER_LOG_OUT = async () => {
    const url = APIS.GET_API.GET_USER_LOG_OUT
    const response = await FetchDataCall(url, "GET", false);
    return response;
}

export { GET_LANDING_EVENTS, GET_USER_DATA, SEND_OTP, LOGIN_IN, SIGN_UP, GET_EVENTS, GET_EVENT_DETAILS, GET_USER_LOG_OUT }