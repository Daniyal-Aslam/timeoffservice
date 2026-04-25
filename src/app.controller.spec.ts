import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  describe('health', () => {
    it('should return service health info', () => {
      jest.spyOn(service, 'getHealth').mockReturnValue({
        status: 'ok',
        service: 'timeoff-service',
        version: '1.0.0',
        uptime: 123,
        timestamp: '2026-01-01T00:00:00.000Z',
      });

      expect(controller.health()).toEqual({
        status: 'ok',
        service: 'timeoff-service',
        version: '1.0.0',
        uptime: 123,
        timestamp: '2026-01-01T00:00:00.000Z',
      });
    });
  });
});