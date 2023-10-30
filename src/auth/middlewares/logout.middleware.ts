import { NestMiddleware } from '@nestjs/common';
import { msalConfig } from '../utils/msalConfig';

export class LogoutMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    let logoutUri = `${msalConfig.auth.authority}/oauth2/v2.0/`;

    logoutUri += `logout?post_logout_redirect_uri=http://localhost:3000/auth/login`;

    req.session.destroy(() => {
      res.redirect(logoutUri);
    });
  }
}
