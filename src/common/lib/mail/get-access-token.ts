import msal from "@azure/msal-node";

const msalConfig: msal.Configuration = {
  auth: {
    clientId: "",
    authority: `https://login.microsoftonline.com/<tenant id>`,
    clientSecret: "secret id",
    knownAuthorities: [],
    cloudDiscoveryMetadata: "",
  },
  system: {
    loggerOptions: {
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
    proxyUrl: "",
    customAgentOptions: {},
  },
};

const tokenRequest = {
  scopes: ["https://outlook.office.com/.default"],
};

export async function getAccessTokenRequest() {
  const cca = new msal.ConfidentialClientApplication(msalConfig);

  const authResponse = await cca.acquireTokenByClientCredential(tokenRequest);
  return authResponse?.accessToken;
}

export const build_XOAuth2_token = async (user: string) => {
  const access_token = await getAccessTokenRequest();
  const xoauth2Token = Buffer.from(
    [`user=${user}`, `auth=Bearer ${access_token}`, "", ""].join("\x01"),
    "utf-8"
  ).toString("base64");
  return xoauth2Token;
};
