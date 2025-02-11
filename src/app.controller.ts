import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  @ApiOperation({ summary: 'test' })
  getHello(): string {
    return this.appService.getHello();
  }
}
