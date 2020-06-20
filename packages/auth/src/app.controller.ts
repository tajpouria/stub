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
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Logger } from '@tajpouria/stub-common/dist/logger';

import { AppService } from 'src/app.service';
import { UsersService } from 'src/users/users.service';
import { ISignUpUserDto, signUpUserDto } from 'src/users/dto/signUp-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { IUser, userValidator } from 'src/users/interfaces/user.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GoogleAuthGuard } from 'src/auth/google-auth.guard';
import { enTempProvider } from 'src/shared/mail-template';
import { ValidationPipe } from 'src/shared/validationPipe';
import { ISignInUserDto } from 'src/users/dto/signIn-user.dto';
import {
  forgotPasswordDto,
  IForgotPasswordDto,
} from 'src/users/dto/forgot-password.dto';
import { updateUserDto, IUpdateUserDto } from 'src/users/dto/update-user.dto';

const { HOST, REDIS_EXPIRY_SECONDS, NODE_ENV } = process.env;

@Controller('/api/auth')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  private logger = Logger(`${process.cwd()}/logs/app`);

  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  @Get('')
  getHello() {
    return this.appService.getHello();
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @UsePipes(new ValidationPipe(signUpUserDto))
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() signUpUserDto: ISignUpUserDto) {
    const { usersService, appService } = this;

    if (await usersService.existingUser(signUpUserDto))
      throw new BadRequestException();

    const token = await appService.redisStoreTokenData(signUpUserDto);
    const confirm_link = await appService.generateConfirmLink('signup', token);

    const template = await enTempProvider({
      forSignUp: true,
      confirm_link,
      hours_to_expire: Math.round(+REDIS_EXPIRY_SECONDS / 60 ** 2),
      host: HOST,
    });

    const { email } = signUpUserDto;

    await appService.sendEmail(email, template);

    return { email };
  }

  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @Get('signup/:token')
  @HttpCode(HttpStatus.CREATED)
  async singUpCallback(
    @Param('token') token: string,
    @Request() req: Express.Request,
  ) {
    const { appService, usersService, authService, logger } = this;

    const data = await appService.redisRetrieveTokenData<ISignUpUserDto>(token);

    const { error } = signUpUserDto.validate(data);
    if (error) {
      NODE_ENV !== 'test' && logger.error(JSON.stringify(error));
      throw new BadRequestException();
    }

    if (await usersService.existingUser(data)) throw new BadRequestException();

    await appService.redisDeleteTokenData(token);

    const user = await usersService.create(data);
    return authService.signIn(user, req);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiBody({ type: ISignInUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Request() req: Express.Request & { user: IUser }) {
    return this.authService.signIn(req.user, req);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: Express.Request & { user: IUser }) {
    return req.user;
  }

  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe(updateUserDto))
  @Put('me')
  @HttpCode(HttpStatus.CREATED)
  async updateMe(
    @Request() req: Express.Request & { user: IUser },
    @Body() updateUserDto: IUpdateUserDto,
  ) {
    const { usersService, authService } = this;

    if (await usersService.existingUser(updateUserDto))
      throw new BadRequestException();

    const newUser = await usersService.findByIdAndUpdate(
      req.user.id,
      updateUserDto,
    );

    return authService.signIn(newUser, req);
  }

  @ApiNoContentResponse()
  @ApiInternalServerErrorResponse()
  @Get('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req: Express.Request) {
    return this.authService.signOut(req);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @UsePipes(new ValidationPipe(forgotPasswordDto))
  @Post('forgotpassword')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() { usernameOrEmail }: IForgotPasswordDto) {
    const { usersService, appService } = this;

    const existingUser = await usersService.findOneByUsernameOrEmail(
      usernameOrEmail,
    );

    if (!existingUser) throw new BadRequestException();

    const token = await appService.redisStoreTokenData(existingUser);
    const confirm_link = await appService.generateConfirmLink(
      'forgotpassword',
      token,
    );

    const template = await enTempProvider({
      forSignUp: false,
      confirm_link,
      hours_to_expire: Math.round(+REDIS_EXPIRY_SECONDS / 60 ** 2),
      host: HOST,
    });

    const { email } = existingUser;

    await appService.sendEmail(email, template);

    return { email };
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @Get('forgotpassword/:token')
  async forgotPasswordCallback(
    @Param('token') token: string,
    @Request() req: Express.Request,
  ) {
    const { appService, logger, authService } = this;

    const data = await appService.redisRetrieveTokenData<IUser>(token);

    const { error } = userValidator.validate(data);
    if (error) {
      NODE_ENV !== 'test' && logger.error(JSON.stringify(error));
      throw new BadRequestException();
    }

    await appService.redisDeleteTokenData(token);

    return authService.signIn(data, req);
  }

  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  @Get('google/signin')
  @UseGuards(GoogleAuthGuard)
  async googleSignIn() {}

  @ApiOkResponse()
  @ApiInternalServerErrorResponse()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req: Express.Request & { user: IUser }) {
    const { usersService, authService } = this;

    let targetUser = await usersService.existingUser(req.user);
    if (!targetUser) targetUser = await usersService.create(req.user);

    return authService.signIn(targetUser, req);
  }
}
