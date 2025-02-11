import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let mockAppService: { getHello: jest.Mock };

  beforeEach(async () => {
    mockAppService = {
      getHello: jest.fn().mockReturnValue('Hello World!'),
    };
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();
    appController = moduleRef.get<AppController>(AppController);
  });

  describe('root', () => {
    it('shoud be define', () => {
      expect(appController).toBeDefined();
    });

    it('should return "Hello World!"', () => {
      const result = appController.getHello();
      expect(result).toBe('Hello World!');
      expect(mockAppService.getHello).toHaveBeenCalledTimes(1);
    });
  });
});
