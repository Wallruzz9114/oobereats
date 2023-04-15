import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../config/services';
import { UserEntity } from '../../../data/entities/user.entity';
import { AuthService } from '../services';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly _authService: AuthService, _configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get().auth.access_token_secret,
    });
  }

  public validate = async (payload: JwtPayload): Promise<UserEntity> => {
    const user = await this._authService.validateJwtPayload(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  };
}
