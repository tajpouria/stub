import { IsEmail, IsString, MinLength, IsAlphanumeric } from 'class-validator';
import { Match } from '@tajpouria/stub-common/dist/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(7)
  @IsAlphanumeric()
  password: string;

  @ApiProperty()
  @Match('password', {
    message: 'Confirm password does not matching the password',
  })
  passwordConfirm: string;
}
