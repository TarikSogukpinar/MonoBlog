import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { HashingModule } from '../utils/hashing/hashing.module';
import { AdminService } from './admin.service';
import { PrismaService } from '../database/database.service';
import { ElasticModule } from '../core/elastic/elastic.module';
import { LoggerModule } from 'src/core/logger/logger.module';

@Module({
  imports: [HashingModule, ElasticModule, LoggerModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
