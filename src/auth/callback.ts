import { userManager } from "./oidcClient";

export const handleCallback = async () => {
    return await userManager.signinRedirectCallback();
};