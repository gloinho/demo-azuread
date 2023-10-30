import { IMsalConfig } from '../interfaces/msal-config';
import { LogLevel } from '@azure/msal-node';
import 'dotenv/config';

export const msalConfig: IMsalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID, // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
    authority: process.env.AUTHORITY, // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
    clientSecret: process.env.CLIENT_SECRET, // Client secret generated from the app registration in Azure portal
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
