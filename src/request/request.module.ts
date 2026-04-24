import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { PrismaService } from '../prisma/prisma.service';
import { HcmModule } from '../hcm/hcm.module';

@Module({
  imports: [HcmModule],
  providers: [RequestService, PrismaService],
  controllers: [RequestController],
})
export class RequestModule {}