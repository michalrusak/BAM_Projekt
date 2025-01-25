import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', 'src', 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'src', 'cert', 'cert.pem')),
  };

  const httpsApp = await NestFactory.create(AppModule, { httpsOptions });
  
  // HTTP App
  const httpApp = await NestFactory.create(AppModule);

  httpsApp.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE, PATCH',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Secure Notes API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(httpApp, config);
  SwaggerModule.setup('api', httpApp, document);

  await Promise.all([
    httpsApp.listen(3001), // HTTPS
    httpApp.listen(3000), // HTTP
  ]);

}
bootstrap();
