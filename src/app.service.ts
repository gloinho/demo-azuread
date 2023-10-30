import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getMsalInstance } from './auth/utils/getMsalInstance';
import { msalConfig } from './auth/utils/msalConfig';

@Injectable()
export class AppService {
  getHello(): string {
    return '<a href="http://localhost:3000/auth/logout">Logout</a>';
  }

  async getGroups(req) {
    const msalInstance = getMsalInstance(msalConfig);
    if (req.session.tokenCache) {
      msalInstance.getTokenCache().deserialize(req.session.tokenCache);
    }
    const tokenResponse = await msalInstance.acquireTokenSilent({
      account: req.session.account,
      scopes: ['Group.Read.All'],
    });
    try {
      const response = await axios.get(
        'https://graph.microsoft.com/v1.0/groups?$select=id,displayName',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        },
      );
      return [...response.data.value];
    } catch (error) {
      return [];
    }
  }
}
