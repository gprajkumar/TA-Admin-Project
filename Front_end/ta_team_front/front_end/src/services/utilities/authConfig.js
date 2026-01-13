export const msalConfig = {
  auth: {
    clientId: "6d689fc7-0260-478d-8857-a6c6927df4fd",                     // React app registration
    authority: "https://login.microsoftonline.com/2fc647ee-9496-4a1d-8d87-105bca14b7ef",
    redirectUri:  window.location.origin + "/",
    postLogoutRedirectUri:  window.location.origin + "/",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [
    "openid",
    "profile",
    "email",
    // Scope from the *Django API* app registration
    "api://67bceed3-96c0-418c-b9c7-9464342aa28b/access_as_user",
  ],
};