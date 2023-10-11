import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import { microserviceConfig } from './microServiceConfig';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,

    options: {
        client: {
            brokers: [`localhost:9091`],
        },
        consumer: {
            groupId: '1',
            allowAutoTopicCreation: true,
        },
    }
});
  
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('DEUNA DOCS')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
