import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule ,{ cors: true });
   // should log 'db'

  app.enableCors({
    origin: '*',
    allowedHeaders: 'Authorization, Content-Type',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
