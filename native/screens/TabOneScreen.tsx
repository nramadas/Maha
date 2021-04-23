import * as React from 'react';
import styled from 'styled-components/native';

import { Autocomplete } from '@/components/controls/Autocomplete/index.native';
import * as B from '@/components/controls/buttons/index.native';
import { Checkbox } from '@/components/controls/Checkbox/index.native';
import * as C from '@/components/controls/chips/index.native';
import { Datepicker } from '@/components/controls/Datepicker/index.native';
import { Input } from '@/components/controls/Input/index.native';
import { InputWithValidation } from '@/components/controls/InputWithValidation/index.native';
import { Radio } from '@/components/controls/Radio/index.native';
import { Select } from '@/components/controls/Select/index.native';
import { Switch } from '@/components/controls/Switch/index.native';

import * as T from '@/components/typography/index.native';

import { useLanguagePack } from '@/hooks/useLanguagePack';
import { i18n } from '@/lib/translate/index.native';

const Container = styled.ScrollView`
  background-color: ${props => props.theme.background};
`;

const Section = styled.View`
  padding: 12px;
`;

export default function TabOneScreen() {
  const [autocompleteValue, setAutocompleteValue] = React.useState<any>(null);
  const [checkboxValue, setCheckboxValue] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [selectedChoice, setSelectedChoice] = React.useState<any>(null);
  const [selectedPickChoices, setSelectedPickChoices] = React.useState<any>([]);
  const [validationInputValue, setValidationInputValue] = React.useState('');
  const [radioValue, setRadioValue] = React.useState(0);
  const [selectValue, setSelectValue] = React.useState<any>(null);
  const [switchValue, setSwitchValue] = React.useState(false);
  const languagePack = useLanguagePack();

  return (
    <Container keyboardShouldPersistTaps="handled">
      <Section>
        <T.H3>Translation</T.H3>
        <T.H4>Using JSX to translate</T.H4>
        <Section>
          <i18n.Translate TextComponent={T.Body1}>
            Hello this is translated
          </i18n.Translate>
        </Section>
        <Section>
          <i18n.Translate TextComponent={T.Body1}>
            Welcome{' '}
            <i18n.Param name="user">
              <T.Body1>Joe</T.Body1>
            </i18n.Param>
            , how are you doing?
          </i18n.Translate>
        </Section>
        <Section>
          <i18n.Translate TextComponent={T.Body1}>
            <i18n.Param name="agent" gender="F">
              <T.Body1>Cathy</T.Body1>
            </i18n.Param>{' '}
            will see you today
          </i18n.Translate>
        </Section>
        <Section>
          <i18n.Translate TextComponent={T.Body1}>
            There are{' '}
            <i18n.Param name="bottleCount" count={4}>
              <T.Body1>4</T.Body1>
            </i18n.Param>{' '}
            bottles on the wall
          </i18n.Translate>
        </Section>
        <Section>
          <i18n.Translate TextComponent={T.Body1}>
            <i18n.Param name="person" gender="M">
              <T.Body1>Henry</T.Body1>
            </i18n.Param>{' '}
            can eat{' '}
            <i18n.Param name="cookies" count={10}>
              <T.Body1>many cookies</T.Body1>
            </i18n.Param>{' '}
            before he feels sick.
          </i18n.Translate>
        </Section>
        <T.H4>Using functions to translate</T.H4>
        <Section>
          <T.Body1>
            {i18n.translate`You can also translate with a tagged template`(
              languagePack,
            )}
          </T.Body1>
        </Section>
        <Section>
          <T.Body1>
            {i18n.translate`Tagged templates take on ${{
              name: 'param',
              value: 'params',
            }} as well.`(languagePack)}
          </T.Body1>
        </Section>
        <Section>
          <T.Body1>
            {i18n.translate`The params can include ${{
              name: 'gender',
              value: 'gender',
              gender: 'M',
            }} too.`(languagePack)}
          </T.Body1>
        </Section>
        <Section>
          <T.Body1>
            {i18n.translate`Same with (${{
              name: 'person',
              value: '4',
              count: 4,
            }}) count`(languagePack)}
          </T.Body1>
        </Section>
        <T.H3>Autocomplete</T.H3>
        <Section>
          <Autocomplete
            label="autocomplete"
            value={autocompleteValue}
            getItems={inputText =>
              ['Apple', 'Bat', 'Cat', 'Dog', 'Elephant', 'Frog', 'Garden']
                .filter(str =>
                  str.toLowerCase().includes((inputText || '').toLowerCase()),
                )
                .map(text => ({ text }))
            }
            onSelect={value => setAutocompleteValue(value)}
          />
        </Section>
        <T.H3>Buttons</T.H3>
        <Section>
          <T.H4>Buttons - Empty</T.H4>
          <B.Empty>Empty</B.Empty>
          <T.H4>Buttons - Filled</T.H4>
          <B.Filled>Filled</B.Filled>
          <T.H4>Buttons - Hollow</T.H4>
          <B.Hollow>Hollow</B.Hollow>
        </Section>
        <T.H3>Checkbox</T.H3>
        <Checkbox
          label="checkbox"
          value={checkboxValue}
          onChange={setCheckboxValue}
        />
        <T.H3>Chips</T.H3>
        <Section>
          <T.H4>Chips - Choice</T.H4>
          <C.Choice
            choices={[
              { text: 'Apple' },
              { text: 'Bat' },
              { text: 'Cat' },
              { text: 'Dog' },
              { text: 'Elephant' },
              { text: 'Frog', disabled: true },
              { text: 'Garden' },
            ]}
            selected={selectedChoice}
            onChoose={setSelectedChoice}
          />
          <T.H4>Chips - Pick</T.H4>
          <C.Pick
            choices={[
              { text: 'Apple' },
              { text: 'Bat' },
              { text: 'Cat' },
              { text: 'Dog' },
              { text: 'Elephant' },
              { text: 'Frog', disabled: true },
              { text: 'Garden' },
            ]}
            selected={selectedPickChoices}
            onChoose={setSelectedPickChoices}
          />
        </Section>
        <T.H3>Datepicker</T.H3>
        <Section>
          <Datepicker label="choose a date" />
          <Datepicker range label="choose a date" />
        </Section>
        <T.H3>Input</T.H3>
        <Section>
          <Input
            label="input"
            value={inputValue}
            onChangeText={text => setInputValue(text)}
          />
          <Input
            error="a random error"
            label="input"
            value={inputValue}
            onChangeText={text => setInputValue(text)}
          />
        </Section>
        <T.H3>InputWithValidation</T.H3>
        <Section>
          <InputWithValidation
            label="input"
            value={validationInputValue}
            onChangeText={text => setValidationInputValue(text)}
            onValidate={text =>
              text.startsWith('Is valid')
                ? ''
                : "text must start with 'Is valid'"
            }
          />
        </Section>
        <T.H3>Radio</T.H3>
        <Section>
          <Radio
            label="1"
            selected={radioValue === 1}
            onSelect={() => setRadioValue(1)}
          />
          <Radio
            label="2"
            selected={radioValue === 2}
            onSelect={() => setRadioValue(2)}
          />
          <Radio
            label="3"
            selected={radioValue === 3}
            onSelect={() => setRadioValue(3)}
          />
        </Section>
        <T.H3>Select</T.H3>
        <Section>
          <Select
            options={[
              { text: 'Apple' },
              { text: 'Bat' },
              { text: 'Cat' },
              { text: 'Dog' },
              { text: 'Elephant' },
              { text: 'Frog' },
              { text: 'Garden' },
            ]}
            placeholder="Please select"
            value={selectValue}
            onChange={setSelectValue}
          >
            {option => <T.Body1>{option.text}</T.Body1>}
          </Select>
        </Section>
        <T.H3>Switch</T.H3>
        <Section>
          <Switch value={switchValue} onChange={setSwitchValue} />
        </Section>
      </Section>
      <Section>
        <T.H3>Typography</T.H3>
        <Section>
          <T.H1>H1</T.H1>
          <T.H2>H2</T.H2>
          <T.H3>H3</T.H3>
          <T.H4>H4</T.H4>
          <T.H5>H5</T.H5>
          <T.H6>H6</T.H6>
          <T.Body1>Body1</T.Body1>
          <T.Body2>Body2</T.Body2>
          <T.Caption>Caption</T.Caption>
          <T.Overline>Overline</T.Overline>
          <T.Subtitle1>Subtitle1</T.Subtitle1>
          <T.Subtitle2>Subtitle2</T.Subtitle2>
        </Section>
      </Section>
    </Container>
  );
}
