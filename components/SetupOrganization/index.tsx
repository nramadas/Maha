import React, { useState } from 'react';
import { useQuery, useMutation } from 'urql';

import { Form } from '@/components/controls/Form';
import { Input } from '@/components/controls/Input';
import { ErrorType } from '@/lib/errors/type';
import { CommonRoleType } from '@/models/CommonRoleType';
import { Organization } from '@/models/Organization';
import { Role } from '@/models/Role';

import { Members } from './Members';

function buildRoles<R extends Pick<Role, 'name'>>(roles: R[]) {
  return roles.sort((a, b) => {
    if (a.name === CommonRoleType.Owner) {
      return -1;
    }

    if (b.name === CommonRoleType.Owner) {
      return 1;
    }

    return a.name.localeCompare(b.name);
  });
}

const getOrganization = `
  query ($orgId: ID!) {
    organizationById(id: $orgId) {
      name
      members {
        id
        email
        firstName
        lastName
        phoneNumber
        roles {
          id
          name
        }
      }
      roles {
        id
        name
        permissions
      }
    }
  }
`;

const setRoles = `
  mutation ($userId: ID!, $roleIds: [ID!]!) {
    setUserRoles (userId: $userId, roleIds: $roleIds) {
      id
    }
  }
`;

interface Props {
  className?: string;
  organizationId: Organization['id'];
}

export function SetupOrganization(props: Props) {
  const [error, setError] = useState<ErrorType | null>(null);

  const [result] = useQuery({
    query: getOrganization,
    variables: { orgId: props.organizationId },
  });

  const [, setUserRoles] = useMutation(setRoles);

  console.log(result);
  console.log(error);
  const data = result.data?.organizationById;

  return (
    <div>
      {data && (
        <Members
          allRoles={buildRoles(data.roles)}
          members={data.members}
          onChangeRoles={(id, roles) => {
            const roleIds = roles.map(role => role.id);
            setUserRoles({ userId: id, roleIds }).then(result => {
              if (result.error) {
                const errorType = result.error.graphQLErrors[0]
                  .message as ErrorType;
                setError(errorType);
              }
            });
          }}
        />
      )}
    </div>
  );
}
