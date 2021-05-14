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
  defaultShowLatLng?: boolean;
  name: string;
  requireLatLng?: boolean;
  onSelect?(loc: LocationModel | null): void;
}

export function AddressAutocomplete(props: Props) {
  const form = useForm();
  const value: Partial<LocationModel> = form.getValue(props.name) || {};
  const [showLatLng, setShowLatLng] = useState(
    props.defaultShowLatLng || false,
  );

  const latInput = useRef<HTMLInputElement | null>(null);
  const lngInput = useRef<HTMLInputElement | null>(null);

  return (
    <div className={cx(props.className, styles.container)}>
      <Input
        __doNotWriteToForm
        className={cx(styles.lat, {
          [styles.vislatlng]: showLatLng,
        })}
        value={value.lat || ''}
        icon={<Latitude />}
        name="lat"
        label={i18n.translate`lat`}
        ref={latInput}
        onInput={e => {
          const lat = parseFloat(e.currentTarget.value);

          if (lat !== value.lat) {
            const newValue = { ...value, lat };
            form.setValue(props.name, newValue);
          }
        }}
      />
      <Input
        __doNotWriteToForm
        className={cx(styles.lng, {
          [styles.vislatlng]: showLatLng,
        })}
        value={value.lng || ''}
        icon={<Longitude />}
        name="lng"
        label={i18n.translate`lng`}
        ref={lngInput}
        onInput={e => {
          const lng = parseFloat(e.currentTarget.value);

          if (lng !== value.lng) {
            const newValue = { ...value, lng };
            form.setValue(props.name, newValue);
          }
        }}
      />
      <Autocomplete
        __doNotWriteToForm
        allowInvalidValues
        className={cx(styles.input, {
          [styles.latLngVisible]: showLatLng,
        })}
        value={
          value.address
            ? { value: value.address, text: value.address }
            : undefined
        }
        icon={<Location />}
        label={i18n.translate`address`}
        name="address"
        getItems={address =>
          !address
            ? []
            : getResults({ variables: { address } }).then(({ data }) =>
                data
                  ? data.matchingAddress.map((match: any) => ({
                      text: match.address,
                      value: match.address,
                      extraData: {
                        googleId: match.googleId,
                      },
                    }))
                  : [],
              )
        }
        onChange={text => {
          if (text !== value.address) {
            const newValue = {
              ...value,
              address: text,
            };

            form.setValue(props.name, newValue);
          }
        }}
        onSelect={item => {
          if (!item) {
            form.setValue(props.name, null);
            props.onSelect?.(null);
            return;
          }

          const googleId = item.extraData.googleId;

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
