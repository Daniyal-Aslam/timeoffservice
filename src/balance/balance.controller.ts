import { Controller, Get, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetBalanceDto } from './dto/get-balance.dto';
import { BalanceResponseDto } from './dto/balance-response.dto';

@ApiTags('Balance')
@Controller('balances')
export class BalanceController {
  constructor(private service: BalanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get employee leave balance' })
  @ApiResponse({ status: 200, type: BalanceResponseDto })
  getBalance(@Query() query: GetBalanceDto) {
    return this.service.getBalance(
      query.employeeId,
      query.locationId,
    );
  }
}