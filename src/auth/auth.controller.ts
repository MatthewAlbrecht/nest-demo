import { Controller, Get, Post, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { Response } from 'express';
/**
 * Controller for user operations.
 */
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signupUser(signupUserDto);
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

  @Get('verify-email')
  @Redirect()
  async verifyEmail(@Query('token') token: string) {
    const { success } = await this.authService.verifyEmail(token);

    return { url: `${process.env.FRONTEND_URL}/login?success=${success}` };
  }
}
