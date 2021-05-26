import 'reflect-metadata';
import { RedisCache } from 'apollo-server-cache-redis';
import { ApolloServer } from 'apollo-server-micro';
import { processRequest } from 'graphql-upload';
import Cors from 'micro-cors';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { useContainer } from 'typeorm';

import { connectToDb } from '@/db';
import { authChecker } from '@/graphql/helpers/authChecker';
import * as resolvers from '@/graphql/resolvers';
import { contextFromHeaders } from '@/lib/authn/contextFromHeaders';

const cors = Cors({
  allowMethods: ['GET', 'POST', 'OPTIONS'],
});

// eslint-disable-next-line
useContainer(Container);

const setup = async () => {
  await connectToDb();

  const schema = await buildSchema({
    authChecker,
    container: Container,
    resolvers: (Object.values(resolvers) as unknown) as [
      Function,
      ...Function[]
    ],
  });

  const apolloServer = new ApolloServer({
    schema,
    cache: new RedisCache({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    context: async ({ req }) => {
      return await contextFromHeaders(req.headers);
    },
    uploads: false,
  });

  return apolloServer.createHandler({ path: '/api/graphql' });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = setup();

export default cors(async function graphql(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.end();
  }

  const contentType = req.headers['content-type'];

  if (contentType && contentType.startsWith('multipart/form-data')) {
    req.filePayload = await processRequest(req, res);
  }

  const h = await handler;

  return h(req, res);
});
