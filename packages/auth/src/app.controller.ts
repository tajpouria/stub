import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  HttpCode,
  Request,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import { AppService } from 'src/app.service';
import { UsersService } from 'src/users/users.service';
import { SignUpUserDto } from 'src/users/dto/signUp-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { SessionObj } from './interfaces/session';
import { User } from './users/interfaces/user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GoogleAuthGuard } from './auth/google-auth.guard';

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
      $or: [
        {
          email: signUpUserDto.email,
        },
        {
          username: signUpUserDto.username,
        },
      ],
    });
    if (existingUser) throw new BadRequestException();

    return await usersService.create(signUpUserDto);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Request() req: Express.Request & { user: User }) {
    const session = this.authService.generateSession(req.user);

    req.session = { session } as SessionObj;

    return { session };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: Express.Request & { user: User }) {
    return req.user;
  }

  @ApiNoContentResponse()
  @ApiInternalServerErrorResponse()
  @Get('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req: Express.Request) {
    req.session = null;
    return;
  }

  @Get('google/signin')
  @UseGuards(GoogleAuthGuard)
  async googleSignIn() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req: Express.Request & { user: User }) {
    const { usersService, authService } = this;
    const { email, username } = req.user;

    let targetUser = await usersService.findOne({
      $or: [
        {
          email,
        },
        {
          username,
        },
      ],
    });

    if (!targetUser) targetUser = await usersService.create(req.user);

    const session = authService.generateSession(req.user);
    req.session = { session } as SessionObj;
    return { session };
  }
}
