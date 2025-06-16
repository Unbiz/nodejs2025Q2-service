import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { load as loadYaml } from 'js-yaml';
import { LoggingService } from './logging/logging.service';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);

  process.on('uncaughtException', async (error) => {
    await loggingService.error(
      `Uncaught Exception: ${error.message}`,
      error.stack,
      'UncaughtException',
    );
    process.exit(1);
  });

  process.on('unhandledRejection', async (reason) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : undefined;
    await loggingService.error(
      `Unhandled Rejection: ${message}`,
      stack,
      'UnhandledRejection',
    );
  });

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
