import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { EnforcerService } from './enforcer.service';

export type ResourceActionPair = [string, string];

export function createPolicyGuard(resource: string, action: string): any;
export function createPolicyGuard(pairs: ResourceActionPair[]): any;
export function createPolicyGuard(
  arg: string | ResourceActionPair[],
  actionArg?: string,
): any {
  let pairs: ResourceActionPair[] = [];
  if (typeof arg === 'string' && actionArg !== undefined) {
    pairs = [[arg, actionArg]];
  } else if (Array.isArray(arg)) {
    pairs = arg;
  }

  @Injectable()
  class PolicyGuard implements CanActivate {
    constructor(private readonly enforcer: EnforcerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
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
