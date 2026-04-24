import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private prisma: PrismaService) {}

  async batchSync() {
    try {
      const res = await axios.get('http://localhost:4000/batch');

      const updates = res.data.map((item: any) =>
        this.prisma.employeeBalance.upsert({
          where: { id: `${item.employeeId}-${item.locationId}` },
          update: {
            balance: item.balance,
            lastSyncedAt: new Date(),
          },
          create: {
            id: `${item.employeeId}-${item.locationId}`,
            ...item,
            lastSyncedAt: new Date(),
          },
        }),
      );

      await Promise.all(updates);  

      this.logger.log(`Synced ${updates.length} balances from HCM`);

      return {
        success: true,
        count: updates.length,
      };
    } catch (error) {
      this.logger.error('Batch sync failed', error.message);

      return {
        success: false,
        error: 'HCM sync failed',
      };
    }
  }
}