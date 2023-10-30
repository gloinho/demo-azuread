import * as msal from '@azure/msal-node';
import { IMsalConfig } from '../interfaces/msal-config';

export function getMsalInstance(msalConfig: IMsalConfig) {
  return new msal.ConfidentialClientApplication(msalConfig);
}
