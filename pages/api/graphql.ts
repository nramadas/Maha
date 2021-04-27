import 'reflect-metadata';
import { RedisCache } from 'apollo-server-cache-redis';
import { ApolloServer } from 'apollo-server-micro';
import Cors from 'micro-cors';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { useContainer } from 'typeorm';

import { connectToDb } from '@/db';
import { authChecker } from '@/graphql/helpers/authChecker';
import * as resolvers from '@/graphql/resolvers';
import { contextFromHeaders } from '@/lib/authn/contextFromHeaders';

// eslint-disable-next-line
useContainer(Container);

const setup = async () => {
  await connectToDb();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      authChecker,
      container: Container,
      resolvers: (Object.values(resolvers) as unknown) as [
        Function,
        ...Function[]
      ],
    }),
    cache: new RedisCache({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    context: async ({ req }) => {
      return await contextFromHeaders(req.headers);
    },
  });

  return apolloServer.createHandler({ path: '/api/graphql' });
};

const handler = setup();

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['GET', 'POST', 'OPTIONS'],
});

export default cors(async (req, res) =>
  req.method === 'OPTIONS' ? res.end() : handler.then(h => h(req, res)),
);
