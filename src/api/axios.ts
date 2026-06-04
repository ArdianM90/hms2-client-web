import axios from "axios";
import { userManager } from "../auth/oidcClient";

export const api = axios.create({
    baseURL: "http://localhost:8082",
});

api.interceptors.request.use(async (config) => {
    const user = await userManager.getUser();

    if (user?.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
    }

    return config;
});