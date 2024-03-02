import { ILogger } from '../../types/ILogger.interface';
import { winstonLogger } from './winston.config';

export class WinstonLoggerAdapter implements ILogger {
  log(message: string, context?: string) {
    winstonLogger.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    winstonLogger.error(message, { context, trace });
  }

  warn(message: string, context?: string) {
    winstonLogger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    winstonLogger.debug(message, { context });
  }
}
