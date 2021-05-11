import { cacheExchange } from '@urql/exchange-graphcache';

type Config = Parameters<typeof cacheExchange>[0];

export const config: Config = {
  keys: {
    Location: data => String(data.address),
    Metropolitan: data => String(data.key),
    OrganizationPage: data => String(data['type']),
  },
};
