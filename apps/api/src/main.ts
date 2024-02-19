//Custom Modules, Packages, Configs, etc.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerService } from './core/swagger/swagger.service';

//pnpm packages
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as compression from 'compression';
import * as hpp from 'hpp';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(
    configService.get<string>('API_GLOBAL_PREFIX', { infer: true }),
  );

  app.enableShutdownHooks();
  app.use(cookieParser());
  app.use(helmet());
  app.use(hpp());
  app.use(compression());

  const swaggerService = app.get(SwaggerService);
  swaggerService.setupSwagger(app);

  const PORT = configService.get<string>('API_PORT', { infer: true }) || 4000;
  await app.listen(PORT);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
