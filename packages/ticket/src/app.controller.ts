import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';

const { NAME } = process.env;

@Controller(`/api/${NAME}`)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello() {
    return this.appService.getHello();
  }
}
