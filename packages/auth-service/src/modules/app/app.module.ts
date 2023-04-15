import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CoreModule } from '../core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CoreModule, TerminusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
