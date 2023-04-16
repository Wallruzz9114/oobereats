import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { AppModule } from './app.module';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use((req: Request, _: Response, next: () => void) => {
    console.log(`Got invoked: '${req.originalUrl}'`);
    next();
  });

  await app.listen(3001);
};

bootstrap();
