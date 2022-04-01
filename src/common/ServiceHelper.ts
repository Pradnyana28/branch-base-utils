import {
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { subDays, addDays } from 'date-fns';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

@Injectable()
export class ServiceHelper {
  constructor(
    @Inject('USER_CLIENT')
    protected readonly client: ClientProxy,
    protected readonly jwtService: JwtService,
  ) {}

  async call(commandKey: string | Record<string, unknown>, payload?: any) {
    Logger.log(`EMIT to '${JSON.stringify(commandKey)}'`);
    return await firstValueFrom(
      this.client.send(commandKey, payload).pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          }
          return throwError(err);
        }),
      ),
    );
  }

  async generateToken(idUser: string, payload: Record<string, unknown>) {
    const today = Date.now();
    const accessTokenExpiredAt = addDays(today, 30);
    const refreshTokenExpiredAt = subDays(accessTokenExpiredAt, 2); // will expired 2 days before access token expiration
    const accessTokenPayload = {
      ...payload,
      expirationDate: accessTokenExpiredAt,
    };
    const refreshTokenPayload = {
      ...accessTokenPayload,
      expirationDate: refreshTokenExpiredAt,
    };
    return {
      userId: idUser,
      accessToken: this.jwtService.sign(accessTokenPayload),
      accessTokenExpiredAt,
      refreshToken: this.jwtService.sign(refreshTokenPayload),
      refreshTokenExpiredAt,
    };
  }

  validateToken(token: string) {
    const isValid = this.jwtService.verify(token);
    Logger.debug('VALIDATE_TOKEN', isValid);
    return isValid;
  }

  hideSensitiveData(data: any) {
    delete (data as any).password;
    delete (data as any).__v;
    return data;
  }
}
