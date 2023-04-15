import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/services';
import { IDbConfig } from './interfaces';

@Module({})
export class DataModule {
  public static forRoot = (dbConfig: IDbConfig) => {
    return {
      module: DataModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return DataModule.getConnectionOptions(configService, dbConfig);
          },
          inject: [ConfigService],
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  };

  private static getConnectionOptions = (
    config: ConfigService,
    dbConfig: IDbConfig
  ): TypeOrmModuleOptions => {
    const dbData = config.get().db;

    if (!dbData) {
      throw Error('');
    }

    const connectionOptions: TypeOrmModuleOptions = {
      type: 'postgres',
      url: dbData.url,
      keepConnectionAlive: true,
      ssl:
        process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
          ? { rejectUnauthorized: false }
          : false,
    };

    return {
      ...connectionOptions,
      entities: dbConfig.entities,
      synchronize: true,
      logging: true,
    };
  };
}
