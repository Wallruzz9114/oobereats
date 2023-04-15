import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private reflector: Reflector) {}

  public canActivate = async (context: ExecutionContext): Promise<boolean> => {
    const roles =
      this.reflector.getAllAndMerge<Roles[]>('roles', [context.getClass(), context.getHandler()]) ||
      [];

    if (roles && roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && !user.permissions) {
      return false;
    }

    const hasRole = () =>
      user.permissions?.split(',').some((role: string) => roles.find((i) => i === role));

    return user && user.permissions && hasRole();
  };
}
