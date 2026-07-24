import api from "../api/api";

export const fetchRemoteConfig = async () => {

    const response = await api.get("/remote-config");

    return response.data;

};