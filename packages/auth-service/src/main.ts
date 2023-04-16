require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { Request, Response } from 'express';
import { AppModule } from './modules';
import { createDocument } from './modules/core/docs/swagger';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.use((_req: Request, _: Response, next: () => void) => {
    next();
  });

  createDocument(app);
  await app.listen(3000 || process.env.PORT);
};

bootstrap();
