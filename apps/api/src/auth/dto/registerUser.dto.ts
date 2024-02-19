import { IsEmail, IsString, IsNotEmpty, Length } from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'Username must be string' })
  @IsNotEmpty({ message: 'Username required' })
  @Length(2, 100, { message: 'Username too long' })
  username: string;

  @IsEmail({}, { message: 'Email must be valid email' })
  @IsNotEmpty({ message: 'Email required' })
  @Length(2, 100, { message: 'Email too long' })
  email: string;

  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password required' })
  @Length(2, 100, { message: 'Password too long' })
  password: string;
}
