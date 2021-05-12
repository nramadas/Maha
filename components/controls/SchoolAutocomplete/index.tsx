import { gql } from '@urql/core';
import cx from 'classnames';
import React, { useState } from 'react';
import { useMutation } from 'urql';

import { Autocomplete } from '@/components/controls/Autocomplete';
import { Book } from '@/components/icons/Book';
import { Trash } from '@/components/icons/Trash';
import { Body2 } from '@/components/typography/Body2';
import { useForm } from '@/hooks/useForm';
import { createRequest } from '@/lib/gql/createRequest';
import { i18n } from '@/lib/translate';
import { School } from '@/models/School';

import styles from './index.module.scss';

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

interface Props<M extends boolean> {
  className?: string;
  name: string;
  multiSelect?: M;
  onSelect?: M extends true
    ? (schools: School) => void
    : (school: School) => void;
}

export function SchoolAutocomplete<M extends boolean>(props: Props<M>) {
  const form = useForm();
  const [, createSchool] = useMutation(createSchoolMutation);
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);

  return (
    <div className={cx(props.className, styles.container)}>
      {props.multiSelect &&
        selectedSchools.map(school => (
          <div className={styles.school} key={school.id}>
            <Body2>{school.name}</Body2>
            <Trash
              className={styles.trashIcon}
              onClick={() => {
                const newSchools = selectedSchools.filter(
                  s => s.id !== school.id,
                );
                form.setValue(props.name, newSchools);
                setSelectedSchools(newSchools);

                // @ts-ignore
                props.onSelect?.(newSchools);
              }}
            />
          </div>
        ))}
      <Autocomplete
        __doNotWriteToForm
        icon={<Book />}
        label={i18n.translate`School name`}
        name="school"
        key={selectedSchools.map(({ id }) => id).join('-')}
        getItems={text =>
          getResults({ variables: { text } }).then(({ data }) =>
            data.matchingPlaces.map((place: any) => ({
              text: place.name,
              googleId: place.googleId,
              location: place.location,
            })),
          )
        }
        onSelect={item => {
          // @ts-ignore
          const { text, googleId, location } = item;

          createSchool({ school: { googleId, location, name: text } }).then(
            result => {
              if (result.data) {
                const newSchool = result.data.createSchool;

                if (props.multiSelect === true) {
                  const curValues = form.getValue(props.name) || [];
                  const newValues = curValues.concat(newSchool);
                  form.setValue(props.name, newValues);
                  props.onSelect?.(newValues);
                  setSelectedSchools(newValues);
                } else {
                  form.setValue(props.name, newSchool);
                  props.onSelect?.(newSchool);
                  setSelectedSchools([newSchool]);
                }
              }
            },
          );
        }}
      />
    </div>
  );
}
