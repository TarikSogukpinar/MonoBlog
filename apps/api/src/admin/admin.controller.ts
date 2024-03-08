import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ConfigService } from '@nestjs/config';
import { ElasticService } from 'src/core/elastic/elastic.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly configService: ConfigService,
    private readonly elasticSearch: ElasticService,
  ) {}

  @Get('getAllLogs')
  @ApiOperation({ summary: 'Get All Logs' })
  @ApiResponse({ status: 200, description: 'All logs listed!' })
  async getAllLogs() {
    const elasticSearchQuery = {
      index: '*',
      body: {
        query: {
          match_all: {},
        },
      },
      size: 1000,
    };

    const result =
      await this.elasticSearch.searchLogsService(elasticSearchQuery);
    return {
      message: 'All logs listed!',
      result,
    };
  }
}
