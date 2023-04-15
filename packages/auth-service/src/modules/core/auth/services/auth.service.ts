import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '../../../config/services';
import { UserEntity } from '../../../data/entities/user.entity';
import { UserService } from '../../user/services';
import { LoginDto } from '../dtos';

@Injectable()
export class AuthService {
  public constructor(
    @Inject(forwardRef(() => UserService))
    private readonly _userService: UserService,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService
  ) {}

  public createToken = async (user: UserEntity) => {
    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      permissions: user.permissions,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this._jwtService.signAsync(jwtPayload, {
        secret: this._configService.get().auth.access_token_secret,
        expiresIn: '15m',
      }),
      this._jwtService.signAsync(jwtPayload, {
        secret: this._configService.get().auth.refresh_token_secret,
        expiresIn: '7d',
      }),
    ]);

    return {
      ...jwtPayload,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  };

  public refreshToken = async (user: UserEntity) => {
    const { refresh_token, email } = user;
    const userData = await this._userService.getUserByEmail(email);

    if (!userData) {
      throw new ForbiddenException();
    }

    const isMatchFound = await bcrypt.compare(refresh_token, userData.refresh_token);

    if (!isMatchFound) {
      throw new ForbiddenException();
    }

    const tokens = await this.createToken(user);
    return tokens;
  };

  public login = async (input: LoginDto) => {
    const { email, password } = input;
    const user = await this._userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException();
    }

    let isMatch = false;

    isMatch = await this.comparePasswords(password, user.password);

    if (isMatch) {
      const data = await this.createToken(user);
      await this.updateRefreshToken(user.email, data.refresh_token);
      return data;
    } else {
      throw new NotFoundException(`user with email password not found`);
    }
  };

  public validateJwtPayload = async (payload: JwtPayload): Promise<UserEntity> =>
    await this._userService.getUserByEmail(payload.email);

  public logout = async (user: UserEntity): Promise<void> => {
    const { email } = user;
    await this._userService.updateRefreshToken(email, null);
  };

  private comparePasswords = async (p1: string, p2: string): Promise<boolean> =>
    await bcrypt.compare(p1, p2);

  private updateRefreshToken = async (email: string, refreshToken: string) =>
    await this._userService.updateRefreshToken(email, refreshToken);
}
