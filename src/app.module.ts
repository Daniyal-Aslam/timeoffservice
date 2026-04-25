import {
  Module,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerMiddleware } from './common/logger.middleware';
import { BalanceModule } from './balance/balance.module';
import { RequestModule } from './request/request.module';
import { SyncModule } from './sync/sync.module';
import { HcmModule } from './hcm/hcm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BalanceModule,
    RequestModule,
    SyncModule,
    HcmModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); 
  }
}