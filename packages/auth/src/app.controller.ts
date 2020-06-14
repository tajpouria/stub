import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  HttpCode,
  Request,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AppService } from 'src/app.service';
import { UsersService } from 'src/users/users.service';
import { SignUpUserDto } from 'src/users/dto/signUp-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('/api/auth')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @Post('signup')
  async signUp(@Body() signUpUserDto: SignUpUserDto) {
    const { usersService } = this;

    const existingUser = await usersService.findOne({
      email: signUpUserDto.email,
    });
    if (existingUser) throw new BadRequestException();

    return await usersService.create(signUpUserDto);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(200)
  async signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }
}
