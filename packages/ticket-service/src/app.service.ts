import { Injectable } from '@nestjs/common';

const { NAME } = process.env;

@Injectable()
export class AppService {
  getHello() {
    return { hello: NAME };
  }
}
