import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

export class UserUpdateDto {
  @ApiProperty()
  readonly username?: string;

  @ApiProperty()
  readonly bio?: string;

  @ApiProperty()
  readonly image?: string;

  @ApiProperty()
  readonly email?: string;

  @ApiProperty()
  password?: string;
}
