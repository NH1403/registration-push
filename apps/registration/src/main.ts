import { NestFactory } from '@nestjs/core';
import { RegistrationModule } from './registration.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(RegistrationModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
