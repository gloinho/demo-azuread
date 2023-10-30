import { IMsalConfig } from '../interfaces/msal-config';
import { LogLevel } from '@azure/msal-node';

export const msalConfig: IMsalConfig = {
  auth: {
    clientId: '848626ad-7931-4541-ad12-6bf0b7ba2bf4', // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
    authority:
      'https://login.microsoftonline.com/' +
      'b06f6a1f-d89f-49f1-80eb-a3a218759d65', // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
    clientSecret: 'Meu8Q~UfaPwWZ3p6qhQ.3SA0iYIpHKFPKIhXpb7V', // Client secret generated from the app registration in Azure portal
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean,
      ): void => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false,
    },
  },
};
