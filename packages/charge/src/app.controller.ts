import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('/api/charge')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello() {
    return this.appService.getHello();
  }
}
