import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { H5pModule } from './h5p/h5p.module';
import { JwtMiddleware } from './auth/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'secret'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    H5pModule,
  ],
  providers: [JwtMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Chỉ áp JWT cho h5p/api/* — /h5p/core và /h5p/editor là static, browser tự load.
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'h5p/api/*', method: RequestMethod.ALL });
  }
}
