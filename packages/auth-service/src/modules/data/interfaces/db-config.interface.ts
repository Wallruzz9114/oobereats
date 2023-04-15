import { DataSourceOptions } from 'typeorm';

export interface IDbConfig {
  entities: DataSourceOptions['entities'];
}
