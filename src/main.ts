import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigAppService } from './modules/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = app.get(ConfigAppService).getPort();
  await app.listen(port);
}
void bootstrap();
