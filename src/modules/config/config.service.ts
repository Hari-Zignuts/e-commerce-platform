import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryConfigType } from 'src/common/interfaces/cloudinary.interface';
import { DatabaseConfig } from 'src/common/interfaces/config.interface';

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

  getDatabaseConfig(): DatabaseConfig {
    const config: DatabaseConfig | undefined =
      this.configService.get('database');
    if (!config) {
      throw new Error(
        'Database config is not defined in the configuration file.',
      );
    }
    return config;
  }

  getCloudinaryConfig(): CloudinaryConfigType {
    const cloudinaryConfig: undefined = this.configService.get('cloudinary');
    if (!cloudinaryConfig) {
      throw new Error('Cloudinary configuration is missing.');
    }
    return cloudinaryConfig;
  }

  get(key: string): unknown {
    const value: unknown = this.configService.get(key);
    if (!value) {
      throw new Error(`Key ${key} is not defined in the configuration file.`);
    }
    return value;
  }
}
