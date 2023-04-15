import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { Logger } from './helpers';
import { LoggerMiddleware } from './middlewares';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule implements NestModule {
  public configure = (consumer: MiddlewareConsumer): void => {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  };
}
