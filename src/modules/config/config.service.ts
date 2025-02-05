import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigAppService {
  constructor(private configService: ConfigService) {}

  getPort(): number {
    const port = this.configService.get<number>('port');
    if (!port) {
      console.log(
        'Port is not defined in the configuration file. Using default port 3000.',
      );
    }
    return port || 3000;
  }
}
