import ROUTERS from "../connect.api";
import GetDataCall from "./requester/request";

const getLandData = async () => {
    return await GetDataCall(ROUTERS.GET_ROUTE.getLandEvent);
};

const getEventById = async (id) => {
    return await GetDataCall(`${ROUTERS.GET_ROUTE.getEvent}/${id}`);
};

export { getLandData, getEventById };