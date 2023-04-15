import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  ssl:
    process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
      ? { rejectUnauthorized: false }
      : false,
  logging: true,
  entities: ['dist/src/modules/data/entities/**/*.entity.js'],
  migrations: ['dist/src/modules/data/migrations/**/*.js'],
  subscribers: ['dist/src/modules/data/subscribers/**/*.js'],
  migrationsTransactionMode: 'each',
};

export const dataSource = new DataSource(dataSourceOptions);
