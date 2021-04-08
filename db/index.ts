import { getConnectionManager } from 'typeorm';

import config from '@/db/ormconfig';

const { cli, migrations, migrationsTableName, ...withoutCli } = config;

export const connectToDb = async () => {
  const manager = getConnectionManager();

  try {
    await manager.get().close();
  } catch (e) {
    if (!(e.name === 'ConnectionNotFoundError')) {
      throw e;
    }
  }

  manager.create(withoutCli);

  try {
    await manager.get().connect();
    console.log('Database connection established');
  } catch (e) {
    console.error('Error: Could not establish connection with database');
    throw e;
  }
};
