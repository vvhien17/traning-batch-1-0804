import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://traning-batch-1-0804.vercel.app',
      'https://traning-batch-1-0804-vvhien17s-projects.vercel.app',
      'https://traning-batch-1-0804-git-main-vvhien17s-projects.vercel.app',
    ], // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow cookies and other credentials if needed
  });
  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Time Management System API')
    .setDescription('XPODC - Training batch01 08-04')
    .setVersion('1.0')
    .addBearerAuth() // Add this if your API uses Bearer Auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
