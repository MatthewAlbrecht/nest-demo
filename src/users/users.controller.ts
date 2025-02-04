import { Controller, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Body } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user-dto';
import { LoginUserDto } from './dto/login-user-dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { Response } from 'express';
/**
 * Controller for user operations.
 */
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Post('signup')
  async signup(
    @Body() signupUserDto: SignupUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, sessionId } =
      await this.usersService.signupUser(signupUserDto);

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
    const { user, sessionId } = await this.usersService.loginUser(loginUserDto);
    res.cookie('session', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { user };
  }
}
