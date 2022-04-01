import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export const UserSession = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    switch (ctx.getType()) {
      case 'rpc': {
        const [payload] = ctx.getArgs();
        if (!payload.idUser) {
          throw new BadRequestException('idUser is required');
        }
        return null;
      }

      default:
        const request = ctx.switchToHttp().getRequest<Request>();
        return (request as any).user;
    }
  },
);
