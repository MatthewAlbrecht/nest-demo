import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionsService } from 'src/sessions/sessions.service';

/**
 * AuthGuard to validate the presence of a valid session cookie.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private sessionsService: SessionsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookies = request.cookies as Record<string, string | undefined>;
    const sessionId = cookies.session;

    if (!sessionId) {
      throw new UnauthorizedException('Session cookie missing');
    }

    const userId = await this.sessionsService.isValidSession(sessionId);

    if (!userId) {
      throw new UnauthorizedException('Invalid session');
    }

    console.log('===HERE===', 'auth.guard');
    request.user = { id: userId };

    return true;
  }
}
