import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { Request } from 'express';
import { EnforcerService } from './enforcer.service';
import { AuthGuard } from './auth.guard';

export type ResourceActionPair = [string, string];

export function createPolicyGuard(
  resource: string,
  action: string,
): Type<CanActivate>;
export function createPolicyGuard(
  pairs: ResourceActionPair[],
): Type<CanActivate>;
export function createPolicyGuard(
  arg: string | ResourceActionPair[],
  actionArg?: string,
): Type<CanActivate> {
  let pairs: ResourceActionPair[] = [];
  if (typeof arg === 'string' && actionArg !== undefined) {
    pairs = [[arg, actionArg]];
  } else if (Array.isArray(arg)) {
    pairs = arg;
  }

  @Injectable()
  class PolicyGuard implements CanActivate {
    constructor(
      private readonly enforcer: EnforcerService,
      private readonly authGuard: AuthGuard,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      await this.authGuard.canActivate(context);

      const req = context.switchToHttp().getRequest<Request>();
      const user = req.user;
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }
      for (const [resource, action] of pairs) {
        const allowed = await this.enforcer.enforce(
          Number(user.id),
          resource,
          action,
        );
        if (!allowed) return false;
      }
      return true;
    }
  }
  return PolicyGuard;
}
