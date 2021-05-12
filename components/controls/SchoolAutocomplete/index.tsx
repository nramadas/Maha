import { gql } from '@urql/core';
import cx from 'classnames';
import React from 'react';
import { useMutation } from 'urql';

import { Autocomplete } from '@/components/controls/Autocomplete';
import { Book } from '@/components/icons/Book';
import { Trash } from '@/components/icons/Trash';
import { Body2 } from '@/components/typography/Body2';
import { useForm } from '@/hooks/useForm';
import { createRequest } from '@/lib/gql/createRequest';
import { i18n } from '@/lib/translate';
import { Location } from '@/models/Location';
import { School } from '@/models/School';

import styles from './index.module.scss';

interface ExtraData {
  googleId: string;
}

const getResults = createRequest`
  query($text: String!) {
    matchingPlaces(text: $text, type: School) {
      googleId
      name
      location {
        address
        lat
        lng
      }
    }
  }
`;

const createSchoolMutation = gql`
  mutation($school: CreateSchool!) {
    createSchool(school: $school) {
      id
      googleId
      name
      location {
        address
        lat
        lng
      }
    }
  }
`;

interface Props {
  className?: string;
  name: string;
  onSelect?: (schools: School) => void;
}

export function SchoolAutocomplete(props: Props) {
  const form = useForm();
  const [, createSchool] = useMutation(createSchoolMutation);

  const selectedSchools: School[] = form.getValue(props.name) || [];

  return (
    <div className={cx(props.className, styles.container)}>
      {selectedSchools.map(school => (
        <div className={styles.school} key={school.id}>
          <Body2>{school.name}</Body2>
          <Trash
            className={styles.trashIcon}
            onClick={() => {
              const newSchools = selectedSchools.filter(
                s => s.id !== school.id,
              );
              form.setValue(props.name, newSchools);
              // @ts-ignore
              props.onSelect?.(newSchools);
            }}
          />
        </div>
      ))}
      <Autocomplete<Location, ExtraData>
        __doNotWriteToForm
        icon={<Book />}
        label={i18n.translate`School name`}
        name="school"
        key={selectedSchools.map(({ id }) => id).join('-')}
        getItems={text =>
          !text
            ? []
            : getResults({ variables: { text } }).then(({ data }) =>
                data
                  ? data.matchingPlaces.map((place: any) => ({
                      text: place.name,
                      value: place.location,
                      extraData: {
                        googleId: place.googleId,
                      },
                    }))
                  : [],
              )
        }
        onSelect={item => {
          if (!item) {
            return;
          }

          const { text, value, extraData } = item;

          createSchool({
            school: {
              googleId: extraData!.googleId,
              location: value,
              name: text,
            },
          }).then(result => {
            if (result.data) {
              const newSchool = result.data.createSchool;
              const curValues = form.getValue(props.name) || [];
              const newValues = curValues.concat(newSchool);
              form.setValue(props.name, newValues);
              props.onSelect?.(newValues);
            }
          });
        }}
      />
    </div>
  );
}
