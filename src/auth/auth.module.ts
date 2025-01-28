import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { isAuthorized } from 'src/middleware';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthorized)
      .exclude(
        { path: 'signup', method: RequestMethod.POST },
        { path: 'login', method: RequestMethod.POST },
      )
      .forRoutes(AuthController);
  }
}
