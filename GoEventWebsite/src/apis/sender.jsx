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

const CREATE_EVENT = async (data) => {
    const url = APIS.POST_API.CREATE_EVENT;
    const response = await FetchDataCall(url, "POST", data);
    return response;
}

const UPLOAD_IMAGE = async (formData) => {
    const url = APIS.POST_API.UPLOAD_IMAGE;
    const response = await FetchDataCall(url, "POST", formData);
    return response;
}

const GET_ORGANIZER_EVENTS = async () => {
    const url = APIS.GET_API.GET_ORGANIZER_EVENTS;
    const response = await FetchDataCall(url, "GET", false);
    return response;
}

const GET_ORGANIZER_EVENT_DETAILS = async (eid) => {
    const url = APIS.GET_API.GET_ORGANIZER_EVENT_DETAILS + "/" + eid;
    const response = await FetchDataCall(url, "GET", false);
    return response;
}

const UPDATE_EVENT = async (eid, data) => {
    const url = APIS.PUT_API.UPDATE_EVENT + "/" + eid;
    const response = await FetchDataCall(url, "PUT", data);
    return response;
}

const DELETE_EVENT = async (eid) => {
    const url = APIS.DELETE_API.DELETE_EVENT + "/" + eid;
    const response = await FetchDataCall(url, "DELETE", false);
    return response;
}

export {
    GET_LANDING_EVENTS,
    GET_USER_DATA,
    SEND_OTP,
    LOGIN_IN,
    SIGN_UP,
    GET_EVENTS,
    GET_EVENT_DETAILS,
    GET_USER_LOG_OUT,
    CREATE_EVENT,
    UPLOAD_IMAGE,
    GET_ORGANIZER_EVENTS,
    DELETE_EVENT,
    GET_ORGANIZER_EVENT_DETAILS,
    UPDATE_EVENT
}