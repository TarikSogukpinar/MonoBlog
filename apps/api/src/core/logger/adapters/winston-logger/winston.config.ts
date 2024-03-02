import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const esTransportOptions = {
  level: 'info',
  indexPrefix: 'search-log-prefix',
  clientOpts: {
    cloud: {
      id: configService.get<string>('ELASTIC_CLOUD_ID'),
    },
    auth: {
      username: configService.get<string>('ELASTICSEARCH_USERNAME'),
      password: configService.get<string>('ELASTICSEARCH_PASSWORD'),
    },
  },

  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
};

const consoleTransportOptions = {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
};

export const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new ElasticsearchTransport(esTransportOptions),
    new winston.transports.Console(consoleTransportOptions),
  ],
});
