import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for creating a new user.
 */
export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
