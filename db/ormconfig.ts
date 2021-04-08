import { ConnectionOptions } from 'typeorm';

import { User } from './entities/User';

const config: ConnectionOptions = {
  cache: {
    type: 'ioredis',
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  },
  cli: {
    migrationsDir: 'db/migrations',
  },
  database: process.env.POSTGRES_DB,
  entities: [User],
  host: process.env.POSTGRES_HOST,
  migrations: ['db/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '', 10),
  type: 'postgres',
  username: process.env.POSTGRES_USER,
};

export default config;
