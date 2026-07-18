import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: (req: Request): string | null =>
        req?.cookies?.refreshToken ?? null,
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_REFRESH_SECRET') as string,
    });
  }

  validate(payload: { sub: string }) {
    if (!payload?.sub) throw new UnauthorizedException();
    return { userId: payload.sub };
  }
}
