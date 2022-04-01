import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    switch (context.getType()) {
      case 'rpc':
        return true;

      default: {
        const req = context.switchToHttp().getRequest<Request>();

        try {
          const payload = this.jwtService.verify(req.headers['authorization']);
          (req as any).user = payload.userAttributes;
          return true;
        } catch (err) {
          Logger.error(err);
          return false;
        }
      }
    }
  }
}
