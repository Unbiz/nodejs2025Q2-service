import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { load as loadYaml } from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const raw = await readFile('doc/api.yaml', 'utf8');
  const doc = loadYaml(raw) as OpenAPIObject;
  SwaggerModule.setup('doc', app, doc);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const PORT = process.env.PORT || 4000;

  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
  console.log(`API is available at http://localhost:${PORT}/doc`);
}
bootstrap();
