import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://127.0.0.1:80',
      credentials: true,
    },
  });

  app.setGlobalPrefix('/api/v1/');
  await app.listen(3000);
}

bootstrap();
