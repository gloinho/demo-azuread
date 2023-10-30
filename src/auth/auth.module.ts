import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HandleRedirectMiddleware } from './middlewares/handle-redirect.middleware';
import { LoginMiddleware } from './middlewares/login.middleware';
import * as msal from '@azure/msal-node';
import { CryptoProvider } from '@azure/msal-node';
import { LogoutMiddleware } from './middlewares/logout.middleware';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: CryptoProvider,
      useFactory: () => {
        return new msal.CryptoProvider();
      },
    },
    LoginMiddleware,
    HandleRedirectMiddleware,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes('/auth/login');
    consumer.apply(HandleRedirectMiddleware).forRoutes('/auth/redirect');
    consumer.apply(LogoutMiddleware).forRoutes('/auth/logout');
  }
}
