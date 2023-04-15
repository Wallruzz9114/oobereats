require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules';
import { createDocument } from './modules/core/docs/swagger';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  createDocument(app);
  await app.listen(3000 || process.env.PORT);
};

bootstrap();
