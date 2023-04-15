import { Injectable } from '@nestjs/common';
import { DEFAULT_CONFIG } from '../constants';
import { IConfig, IDbInfo, ISwaggerCredentials } from '../interfaces';

@Injectable()
export class ConfigService {
  private _config: IConfig;

  public constructor(public config: IConfig = DEFAULT_CONFIG) {
    this._config = config;
  }

  public loadFromEnv = (): void => {
    this._config = this.parseConfigFromEnv(process.env);
  };

  public get(): Readonly<IConfig> {
    return this._config;
  }

  private parseConfigFromEnv = (env: NodeJS.ProcessEnv): IConfig => {
    return {
      env: env.NODE_ENV || DEFAULT_CONFIG.env,
      port: parseInt(env.PORT, 10),
      db: this.parseDbConfig(env, DEFAULT_CONFIG.db),
      swagger: this.parseSwaggerConfig(env, DEFAULT_CONFIG.swagger),
      logLevel: env.LOG_LEVEL,
      auth: {
        expiresIn: Number(env.TOKEN_EXPIRY),
        access_token_secret: env.JWT_ACCESS_TOKEN_SECRET,
        refresh_token_secret: env.JWT_REFRESH_TOKEN_SECRET,
      },
    };
  };

  private parseDbConfig = (env: NodeJS.ProcessEnv, defaultConfig: Readonly<IDbInfo>): IDbInfo => {
    return {
      url: env.DATABASE_URL || defaultConfig.url,
    };
  };

  private parseSwaggerConfig = (
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ISwaggerCredentials>
  ) => {
    return {
      username: env.SWAGGER_USERNAME || defaultConfig.username,
      password: env.SWAGGER_PASSWORD || defaultConfig.password,
    };
  };
}
