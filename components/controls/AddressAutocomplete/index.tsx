import cx from 'classnames';
import React, { useState, useRef } from 'react';

import { Autocomplete } from '@/components/controls/Autocomplete';
import { Input } from '@/components/controls/Input';
import { Latitude } from '@/components/icons/Latitude';
import { Location } from '@/components/icons/Location';
import { Longitude } from '@/components/icons/Longitude';
import { useForm } from '@/hooks/useForm';
import { createRequest } from '@/lib/gql/createRequest';
import { i18n } from '@/lib/translate';
import { Location as LocationModel } from '@/models/Location';

import styles from './index.module.scss';

const getResults = createRequest`
  query($address: String!) {
    matchingAddress(address: $address) {
      address
      googleId
    }
  }
`;

const getLocation = createRequest`
  query($googleId: String!) {
    googleIdToLocation(googleId: $googleId) {
      lat
      lng
    }
  }
`;

interface Props {
  className?: string;
  name: string;
  requireLatLng?: boolean;
  onSelect?(loc: LocationModel): void;
}

export function AddressAutocomplete(props: Props) {
  const form = useForm();
  const [showLatLng, setShowLatLng] = useState(false);
  const latInput = useRef<HTMLInputElement | null>(null);
  const lngInput = useRef<HTMLInputElement | null>(null);
  const defaultValues = useRef(form.getFormValues());
  const defaultValue = defaultValues.current[props.name] || {};

  return (
    <div className={cx(props.className, styles.container)}>
      <Input
        __doNotWriteToForm
        className={cx(styles.lat, {
          [styles.vislatlng]: showLatLng,
        })}
        defaultValue={defaultValue['lat']}
        icon={<Latitude />}
        name="lat"
        label={i18n.translate`lat`}
        ref={latInput}
      />
      <Input
        __doNotWriteToForm
        className={cx(styles.lng, {
          [styles.vislatlng]: showLatLng,
        })}
        defaultValue={defaultValue['lng']}
        icon={<Longitude />}
        name="lng"
        label={i18n.translate`lng`}
        ref={lngInput}
      />
      <Autocomplete
        __doNotWriteToForm
        className={cx(styles.input, {
          [styles.latLngVisible]: showLatLng,
        })}
        defaultValue={defaultValue['address']}
        icon={<Location />}
        label={i18n.translate`address`}
        name="address"
        getItems={address =>
          getResults({ variables: { address } }).then(({ data }) =>
            data.matchingAddress.map((match: any) => ({
              text: match.address,
              googleId: match.googleId,
            })),
          )
        }
        onSelect={item => {
          //@ts-ignore
          const googleId = item.googleId;

          getLocation({ variables: { googleId } }).then(({ data }) => {
            if (props.requireLatLng) {
              setShowLatLng(true);
            }

            const newVal = {
              address: item.text as string,
              lat: undefined,
              lng: undefined,
            };

            if (data?.googleIdToLocation) {
              const { lat, lng } = data.googleIdToLocation;

              if (latInput.current) {
                latInput.current.value = lat;
              }

              if (lngInput.current) {
                lngInput.current.value = lng;
              }

              newVal.lat = lat;
              newVal.lng = lng;
            }

            form.setValue(props.name, newVal);
            props.onSelect?.(newVal);
          });
        }}
      />
    </div>
  );
}
