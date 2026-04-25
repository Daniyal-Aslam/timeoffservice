import { Controller, Post, HttpCode } from '@nestjs/common';
import { SyncService } from './sync.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SyncResponseDto } from './dto/sync-response.dto';

@ApiTags('Sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('batch')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sync balances from HCM' })
  @ApiResponse({
    status: 200,
    description: 'Balances synced successfully',
    type: SyncResponseDto,
  })
  @ApiResponse({
    status: 502,
    description: 'HCM sync failed',
  })
  async batchSync(): Promise<SyncResponseDto> {
    return this.syncService.batchSync();
  }
}