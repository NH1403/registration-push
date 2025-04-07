import { NestFactory } from '@nestjs/core';
import { PushModule } from './push.module';
import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(PushModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.connectMicroservice(rmqService.getOptions('push'));
  await app.startAllMicroservices();
}
bootstrap();
