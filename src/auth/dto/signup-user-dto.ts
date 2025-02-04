import { IsEmail, MinLength, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for creating a new user.
 */
export class SignupUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;
}
