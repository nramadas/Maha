import { getConnection, Repository } from 'typeorm';

import * as entities from '@/db/entities';

type Entities = typeof entities;
type EntityName = keyof Entities;

type Acc = {
  [K in EntityName]: () => Repository<InstanceType<Entities[K]>>;
};

export default (Object.keys(entities) as EntityName[]).reduce<Acc>(
  <N extends EntityName>(acc: Acc, name: N) => {
    acc[name] = (() => {
      const entity = entities[name];
      const connection = getConnection();
      return connection.getRepository(entity);
    }) as Acc[N];
    return acc;
  },
  {} as Acc,
);
