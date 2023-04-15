import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../../config/config.module';
import { LoggerModule } from '../../logger/logger.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { AccessTokenJwtStrategy, RefreshTokenJwtStrategy } from './strategies';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenJwtStrategy, AccessTokenJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
