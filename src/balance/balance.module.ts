import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BalanceService, PrismaService],
  controllers: [BalanceController],
  exports: [BalanceService],
})
export class BalanceModule {}