import { IAuthConfig } from './auth-config.interface';
import { IDbInfo } from './db-info.interface';
import { ISwaggerCredentials } from './swagger-credentials.interface';

export interface IConfig {
  env: string;
  port: number;
  db: IDbInfo;
  swagger: ISwaggerCredentials;
  logLevel: string;
  auth: IAuthConfig;
}
