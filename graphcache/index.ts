import { gql } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';

type Config = Parameters<typeof cacheExchange>[0];

export const config: Config = {
  keys: {
    Location: data => String(data.address),
    MapPoint: data => null,
    Metropolitan: data => String(data.key),
    OrganizationPage: data => String(data['type']),
  },
  updates: {
    Mutation: {
      createProperty: (result, args, cache) => {
        const query = gql`
          query {
            me {
              id
              organization {
                id
                properties {
                  id
                }
              }
            }
          }
        `;

        cache.updateQuery({ query }, data => {
          data.me.organization?.properties.push(result.createProperty);
          return data;
        });
      },
      createRole: (result, args, cache) => {
        const query = gql`
          query {
            me {
              id
              organization {
                id
                roles {
                  id
                }
              }
            }
          }
        `;

        cache.updateQuery({ query }, data => {
          data.me.organization?.roles.push(result.createRole);
          return data;
        });
      },
      deleteProperty: (result, args, cache) => {
        const query = gql`
          query {
            me {
              id
              organization {
                id
                properties {
                  id
                }
              }
            }
          }
        `;

        cache.updateQuery({ query }, data => {
          const properties = data.me.organization.properties.filter(
            (p: any) => p.id !== args.id,
          );
          data.me.organization.properties = properties;
          return data;
        });
      },
      deleteRole: (result, args, cache) => {
        const query = gql`
          query {
            me {
              id
              organization {
                id
                roles {
                  id
                }
              }
            }
          }
        `;

        cache.updateQuery({ query }, data => {
          const roles = data.me.organization.roles.filter(
            (r: any) => r.id !== args.id,
          );
          data.me.organization.roles = roles;
          return data;
        });
      },
      inviteUserToOrganization: (result, args, cache) => {
        const query = gql`
          query {
            me {
              id
              organization {
                id
                pendingInvites {
                  id
                }
              }
            }
          }
        `;

        cache.updateQuery({ query }, data => {
          data.me.organization.pendingInvites.push(
            result.inviteUserToOrganization,
          );
          return data;
        });
      },
    },
  },
};
