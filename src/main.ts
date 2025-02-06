import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  // Configura globalmente o filtro de exceções para tratamento consistente de erros
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Configura globalmente o interceptor para log de requisições e tempo de resposta
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Aplicação rodando na porta ${port}`);
}

bootstrap();
