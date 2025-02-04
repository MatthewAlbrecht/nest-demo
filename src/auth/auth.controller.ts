import { Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { Response } from 'express';
/**
 * Controller for user operations.
 */
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() signupUserDto: SignupUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, sessionId } =
      await this.authService.signupUser(signupUserDto);

    res.cookie('session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { user };
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, sessionId } = await this.authService.loginUser(loginUserDto);
    res.cookie('session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { user };
  }
}
