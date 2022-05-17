import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap () {
  const { APP_PORT, APP_HOST } = process.env;
  const app = await NestFactory.create(AppModule);
  await app.listen(+APP_PORT, () => {
    console.log(`App running on http://${APP_HOST}:${APP_PORT}`);
  });
}
bootstrap();
