import React, { memo } from 'react';

import { Form } from '@/components/controls/Form';
import { Number } from '@/components/controls/Number';
import { Price } from '@/components/controls/Price';
import { H4 } from '@/components/typography/H4';
import { H6 } from '@/components/typography/H6';
import { DomContainerProvider } from '@/contexts/DomContainer';
import { useTextToString } from '@/hooks/useTextToString';
import { i18n } from '@/lib/translate';
import { Text } from '@/models/Text';

import { Footer } from './Footer';
import styles from './index.module.scss';
import { Section } from './Section';

function formToFilters(formValues: any) {
  return {
    maxPrice: (formValues.maxPrice as number) || undefined,
    minPrice: (formValues.minPrice as number) || undefined,
    maxSqft: (formValues.maxSqft as number) || undefined,
    minSqft: (formValues.minSqft as number) || undefined,
    minNumBedrooms: (formValues.minNumBedrooms as number) || undefined,
    minNumBathrooms: (formValues.minNumBathrooms as number) || undefined,
  } as const;
}

export type AppliedFilters = ReturnType<typeof formToFilters>;

interface Props {
  className?: string;
  title: Text;
  onFilterChange?(newFilters: AppliedFilters): void;
}

export const Filters = memo(function Filters(props: Props) {
  const textToString = useTextToString();

  return (
    <div className={styles.container}>
      <H4 className={styles.title} title={textToString(props.title)}>
        {textToString(props.title)}
      </H4>
      <header className={styles.header}>
        <H6>
          <i18n.Translate>Filters</i18n.Translate>
        </H6>
      </header>
      <Form
        className={styles.filters}
        onChange={formValues =>
          props.onFilterChange?.(formToFilters(formValues))
        }
      >
        <div className={styles.formContent}>
          <DomContainerProvider>
            <Section title={i18n.translate`price`}>
              <div className={styles.col_2}>
                <Price
                  noIcon
                  name="minPrice"
                  label={i18n.translate`min price`}
                />
                <Price
                  noIcon
                  name="maxPrice"
                  label={i18n.translate`max price`}
                />
              </div>
            </Section>
            <Section title={i18n.translate`sqft`}>
              <div className={styles.col_1}>
                <Number name="minSqft" label={i18n.translate`min sqft`} />
              </div>
            </Section>
            <Section title={i18n.translate`layout`}>
              <div className={styles.col_2}>
                <Number
                  name="minNumBedrooms"
                  label={i18n.translate`num beds`}
                />
                <Number
                  name="minNumBathrooms"
                  label={i18n.translate`num bath`}
                />
              </div>
            </Section>
          </DomContainerProvider>
        </div>
        <Footer />
      </Form>
    </div>
  );
});
