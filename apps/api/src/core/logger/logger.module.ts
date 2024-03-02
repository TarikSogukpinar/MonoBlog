import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

import { ElasticModule } from '../elastic/elastic.module';

@Module({
  imports: [ElasticModule],
  providers: [LoggerService],
  exports: [LoggerService],
  controllers: [],
})
export class LoggerModule {}
