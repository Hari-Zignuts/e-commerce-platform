import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigAppService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`,
      load: [configuration],
    }),
  ],
  providers: [ConfigAppService],
})
export class ConfigAppModule {}
