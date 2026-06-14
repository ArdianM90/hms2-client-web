import { UserManager } from "oidc-client-ts";

export const userManager = new UserManager({
  authority: "http://localhost:8081",
  client_id: "hms-web",
  redirect_uri: "http://localhost:5173/callback",
  post_logout_redirect_uri: "http://localhost:5173/logout",
  response_type: "code",
  scope: "openid",
});
