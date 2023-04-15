import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { UserEntity } from '../../data/entities/user.entity';
import { LoggerModule } from '../../logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './controllers';
import { UserService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    LoggerModule,
    ConfigModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
