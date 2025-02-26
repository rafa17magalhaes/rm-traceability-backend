/* eslint-disable @typescript-eslint/no-floating-promises */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('RM Traceability API')
    .setDescription('Documentação da API de RM Traceability')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Disponibiliza a UI do Swagger em /api
  SwaggerModule.setup('api', app, document);

  // Lê a porta de APP_PORT ou usa 3001 como fallback
  const port = process.env.APP_PORT ?? 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`Aplicação rodando na porta ${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api`);
}

bootstrap();
