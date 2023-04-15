import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '../config/config.module';
import { DataModule } from '../data/data.module';
import { UserEntity } from '../data/entities/user.entity';
import { LoggerModule } from '../logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DataModule.forRoot({
      entities: [UserEntity],
    }),
    UserModule,
    AuthModule,
    TerminusModule,
    LoggerModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {}
