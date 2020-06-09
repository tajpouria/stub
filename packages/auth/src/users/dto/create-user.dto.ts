import { IsEmail, Matches, IsString, MinLength } from 'class-validator';
import { Match } from '@tajpouria/stub-common/dist/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(7)
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z]).{7,}$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty()
  @Match('password', { message: 'confirm password doest not match' })
  passwordConfirm: string;
}
