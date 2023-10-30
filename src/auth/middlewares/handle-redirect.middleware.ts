import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { getMsalInstance } from '../utils/getMsalInstance';
import { msalConfig } from '../utils/msalConfig';
import { CryptoProvider } from '@azure/msal-node';

@Injectable()
export class HandleRedirectMiddleware implements NestMiddleware {
  constructor(
    @Inject(CryptoProvider)
    private cryptoProvider: CryptoProvider,
  ) {}

  async use(req: any, res: any, next: NextFunction) {
    if (!req.body || !req.body.state) {
      return next(new Error('Error: response not found'));
    }

    const authCodeRequest = {
      ...req.session.authCodeRequest,
      code: req.body.code,
      codeVerifier: req.session.pkceCodes.verifier,
    };

    try {
      const msalInstance = getMsalInstance(msalConfig);

      if (req.session.tokenCache) {
        msalInstance.getTokenCache().deserialize(req.session.tokenCache);
      }

      const tokenResponse = await msalInstance.acquireTokenByCode(
        authCodeRequest,
        req.body,
      );

      req.session.tokenCache = msalInstance.getTokenCache().serialize();
      req.session.idToken = tokenResponse.idToken;
      req.session.account = tokenResponse.account;
      req.session.isAuthenticated = true;

      const state = JSON.parse(
        this.cryptoProvider.base64Decode(req.body.state),
      );
      res.redirect(state.successRedirect);
    } catch (error) {
      next(error);
    }
  }
}
