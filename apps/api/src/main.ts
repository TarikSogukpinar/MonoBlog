//Custom Modules, Packages, Configs, etc.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

//pnpm packages
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as compression from 'compression';
import * as hpp from 'hpp';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  app.use(cookieParser());
  app.use(helmet());
  app.use(hpp());
  app.use(compression());

  const PORT = configService.get<string>('API_PORT', { infer: true }) || 4000;
  await app.listen(PORT);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
