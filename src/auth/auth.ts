import {userManager} from "./oidcClient";

export const login = () => userManager.signinRedirect();

export const logout = () => userManager.signoutRedirect();

export const getUser = () => userManager.getUser();

export const isAuthenticated = async () => {
    const user = await userManager.getUser();
    return user !== null && !user.expired;
};