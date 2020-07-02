import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('/api/ticket')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello() {
    return this.appService.getHello();
  }
}
