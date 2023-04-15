module.exports = {
  type: process.env.DB_DIALECT || 'postgres',
  url: process.env.DATABASE_URL,
  charset: 'utf8mb4',
  synchronize: false,
  ssl:
    process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
      ? { rejectUnauthorized: false }
      : false,
  logging: true,
  entities: ['dist/src/modules/data/entities/**/*.entity.js'],
  migrations: ['dist/src/modules/data/migrations/**/*.js'],
  subscribers: ['dist/src/modules/data/subscribers/**/*.js'],
  cli: {
    entitiesDir: 'src/modules/data/entities/**/*.entity.js',
    migrationsDir: 'src/modules/data/migrations',
    subscribersDir: 'src/modules/data/subscribers',
  },
  migrationsTransactionMode: 'each',
};
