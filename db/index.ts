import { getConnectionManager } from 'typeorm';

import config from '@/db/ormconfig';
import { log } from '@/lib/log/server';

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
    log({ subject: 'Database connection established' });
  } catch (e) {
    log({
      error: true,
      subject: 'Error: Could not establish connection with database',
      text: e.toString(),
    });
    throw e;
  }
};
