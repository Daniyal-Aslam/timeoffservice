import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BalanceModule } from './balance/balance.module';
import { RequestModule } from './request/request.module';
import { SyncModule } from './sync/sync.module';
import { HcmModule } from './hcm/hcm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env available everywhere
    }),
    BalanceModule,
    RequestModule,
    SyncModule,
    HcmModule,
  ],
})
export class AppModule {}