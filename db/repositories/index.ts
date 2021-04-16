import { getConnection, Repository } from 'typeorm';

import * as entities from '@/db/entities';

type Entities = typeof entities;
type EntityName = keyof Entities;

export default Object.keys(entities).reduce((acc, name) => {
  acc[name as EntityName] = () => {
    const entity = entities[name as EntityName];
    const connection = getConnection();
    return connection.getRepository(entity);
  };
  return acc;
}, {} as { [K in EntityName]: () => Repository<InstanceType<Entities[K]>> });
