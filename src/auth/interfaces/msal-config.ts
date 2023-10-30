export interface IMsalConfig {
  auth: {
    clientId: string; // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
    authority: string; // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
    clientSecret: string; // Client secret generated from the app registration in Azure portal
    cloudDiscoveryMetadata?: string;
    authorityMetadata?: string;
  };
  system: {
    loggerOptions: object;
  };
}

// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/performance.md
