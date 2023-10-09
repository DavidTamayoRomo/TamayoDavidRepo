import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { microserviceConfig } from './microServiceConfig';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(microserviceConfig);
  
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //forbidNonWhitelisted: true,
    })
  );

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
