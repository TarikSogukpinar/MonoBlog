import { Injectable } from '@nestjs/common';
import { ILogger } from './types/ILogger.interface';
import { WinstonLoggerAdapter } from './adapters/winston-logger/winstonLogger.adapter';

@Injectable()
export class LoggerService {
  private loggerService: ILogger;

  constructor() {
    this.loggerService = new WinstonLoggerAdapter();
  }

  log(message: string, context?: string) {
    this.loggerService.log(message, context);
  }

  error(message: string, trace: string, context?: string) {
    this.loggerService.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.loggerService.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.loggerService.debug(message, context);
  }
}
