import { Test, TestingModule } from '@nestjs/testing';
import { ConfigAppService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigAppService],
    }).compile();

    service = module.get<ConfigAppService>(ConfigAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
