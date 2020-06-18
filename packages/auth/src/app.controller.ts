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
  Param,
  UsePipes,
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
import { ISignUpUserDto, signUpUserDto } from 'src/users/dto/signUp-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/interfaces/user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { enTempProvider } from 'src/shared/mail-template';
import { ValidationPipe } from 'src/shared/validationPipe';

const { HOST } = process.env;

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
  @UsePipes(new ValidationPipe(signUpUserDto))
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() signUpUserDto: ISignUpUserDto) {
    const { usersService, appService } = this;

    if (await usersService.existingUser(signUpUserDto))
      throw new BadRequestException();

    const token = await appService.redisStoreTokenData(signUpUserDto),
      confirm_link = await appService.generateConfirmLink('signup', token);

    const { REDIS_EXPIRY_SECONDS } = process.env;

    const template = await enTempProvider({
      forSignUp: true,
      confirm_link,
      hours_to_expire: Math.round(+REDIS_EXPIRY_SECONDS / 60 ** 2),
      host: HOST,
    });

    appService.sendEmail(signUpUserDto.email, template);

    return { email: signUpUserDto.email };
  }

  @Get('signup/:token')
  @HttpCode(HttpStatus.CREATED)
  async singUpCallback(
    @Param('token') token: string,
    @Request() req: Express.Request,
  ) {
    const { appService, usersService, authService } = this;

    const data = await appService.redisRetrieveTokenData<ISignUpUserDto>(token);

    const { error } = signUpUserDto.validate(data);
    if (error) throw new BadRequestException();

    await appService.redisDeleteTokenData(token);

    const user = await usersService.create(data);

    return authService.signIn(user, req);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @UsePipes(new ValidationPipe(signUpUserDto))
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Request() req: Express.Request & { user: User }) {
    return this.authService.signIn(req.user, req);
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

    let targetUser = await usersService.existingUser(req.user);
    if (!targetUser) targetUser = await usersService.create(req.user);

    return authService.signIn(targetUser, req);
  }
}
