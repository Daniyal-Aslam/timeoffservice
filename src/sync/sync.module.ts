import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { PrismaService } from '../prisma/prisma.service';
import { HcmModule } from '../hcm/hcm.module'; // ✅ ADD THIS

@Module({
  imports: [HcmModule], // ✅ IMPORTANT
  providers: [SyncService, PrismaService],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {}