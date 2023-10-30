import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import axios from 'axios';
import { msalConfig } from '../utils/msalConfig';
import { CryptoProvider, ResponseMode } from '@azure/msal-node';
import { getMsalInstance } from '../utils/getMsalInstance';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  constructor(
    @Inject(CryptoProvider)
    private cryptoProvider: CryptoProvider,
  ) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const state = this.cryptoProvider.base64Encode(
      JSON.stringify({
        successRedirect: '/',
      }),
    );

    if (
      !msalConfig.auth.cloudDiscoveryMetadata ||
      !msalConfig.auth.authorityMetadata
    ) {
      const [cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
        this.getCloudDiscoveryMetadata(msalConfig.auth.authority),
        this.getAuthorityMetadata(msalConfig.auth.authority),
      ]);

      msalConfig.auth.cloudDiscoveryMetadata = JSON.stringify(
        cloudDiscoveryMetadata,
      );
      msalConfig.auth.authorityMetadata = JSON.stringify(authorityMetadata);
    }

    req.authCodeUrlRequestParams = {
      state: state,
      scopes: [],
      redirectUri: 'http://localhost:3000/auth/redirect',
    };
    const { verifier, challenge } =
      await this.cryptoProvider.generatePkceCodes();

    req.authCodeRequestParams = {
      state: state,
      scopes: [],
      redirectUri: 'http://localhost:3000/auth/redirect',
    };

    req.session.pkceCodes = {
      challengeMethod: 'S256',
      verifier: verifier,
      challenge: challenge,
    };

    req.session.authCodeUrlRequest = {
      ...req.authCodeUrlRequestParams,
      responseMode: ResponseMode.FORM_POST,
      codeChallenge: req.session.pkceCodes.challenge,
      codeChallengeMethod: req.session.pkceCodes.challengeMethod,
    };

    req.session.authCodeRequest = {
      ...req.authCodeRequestParams,
      code: '',
    };

    try {
      const msalInstance = getMsalInstance(msalConfig);
      const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(
        req.session.authCodeUrlRequest,
      );
      res.redirect(authCodeUrlResponse);
    } catch (error) {
      next(error);
    }

    next();
  }
  // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/performance.md
  async getCloudDiscoveryMetadata(authority: string) {
    const endpoint =
      'https://login.microsoftonline.com/common/discovery/instance';

    try {
      const response = await axios.get(endpoint, {
        params: {
          'api-version': '1.1',
          authorization_endpoint: `${authority}/oauth2/v2.0/authorize`,
        },
      });

      return await response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAuthorityMetadata(authority: string) {
    const endpoint = `${authority}/v2.0/.well-known/openid-configuration`;

    try {
      const response = await axios.get(endpoint);
      return await response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
