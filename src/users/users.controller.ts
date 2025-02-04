import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Body } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user-dto';
import { LoginUserDto } from './dto/login-user-dto';

/**
 * Controller for user operations.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  signup(@Body() signupUserDto: SignupUserDto) {
    return this.usersService.signupUser(signupUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.loginUser(loginUserDto);
  }
}
