import { Controller, Get, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('balances')
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @Get()
  getBalance(
    @Query('employeeId') employeeId: string,
    @Query('locationId') locationId: string,
  ) {
    return this.balanceService.getBalance(employeeId, locationId);
  }
} 