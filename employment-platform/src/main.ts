import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from 'src/common/interceptors/response/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // habilita CORS
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  setupSwagger(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
