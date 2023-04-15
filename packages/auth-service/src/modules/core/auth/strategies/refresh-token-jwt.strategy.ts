import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../config/services';
import { AuthService } from '../services';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  public constructor(private readonly _authService: AuthService, _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get().auth.refresh_token_secret,
      passReqToCallback: true,
    });
  }

  public validate = async (req: Request, payload: JwtPayload) => {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    const user = await this._authService.validateJwtPayload(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { ...user, refresh_token: refreshToken };
  };
}
