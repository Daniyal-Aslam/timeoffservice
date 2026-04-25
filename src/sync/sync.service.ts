import { Injectable, Logger, BadGatewayException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HcmAdapter } from '../hcm/hcm.adapter';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private prisma: PrismaService,
    private hcm: HcmAdapter,
  ) {}

  async batchSync() {
    try {
      const data = await this.hcm.getBatchBalances();
  
      if (!Array.isArray(data)) {
        throw new Error('Invalid HCM response');
      }
  
      const updates = data.map((item) =>
        this.prisma.employeeBalance.upsert({
          where: {
            employeeId_locationId: {
              employeeId: item.employeeId,
              locationId: item.locationId,
            },
          },
          update: {
            balance: item.balance,
            lastSyncedAt: new Date(),
          },
          create: {
            employeeId: item.employeeId,
            locationId: item.locationId,
            balance: item.balance,
            lastSyncedAt: new Date(),
          },
        }),
      );
  
      await Promise.all(updates);
  
      return {
        success: true,
        count: updates.length,
      };
    } catch (error) {
      this.logger.error('Batch sync failed', error?.message || error);
      throw new BadGatewayException('HCM sync failed');
    }
  }
}