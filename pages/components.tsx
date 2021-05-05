import React from 'react';

import { Autocomplete } from '@/components/controls/Autocomplete';
import * as buttons from '@/components/controls/buttons';
import { Checkbox } from '@/components/controls/Checkbox';
import * as chips from '@/components/controls/chips';
import { Datepicker } from '@/components/controls/Datepicker';
import { Form } from '@/components/controls/Form';
import { Input } from '@/components/controls/Input';
import { InputWithValidation } from '@/components/controls/InputWithValidation';
import * as links from '@/components/controls/links';
import { Radio } from '@/components/controls/Radio';
import { Select } from '@/components/controls/Select';
import { Switch } from '@/components/controls/Switch';

import { Calendar } from '@/components/icons/Calendar';
import { Checkmark } from '@/components/icons/Checkmark';
import { ChevronDown } from '@/components/icons/ChevronDown';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { ChevronUp } from '@/components/icons/ChevronUp';
import { Close } from '@/components/icons/Close';
import { Google } from '@/components/icons/Google';
import { House } from '@/components/icons/House';

import * as T from '@/components/typography';

import { useLanguagePack } from '@/hooks/useLanguagePack';
import { i18n } from '@/lib/translate';

const iconStyle = {
  height: 40,
  width: 40,
  fill: 'var(--color-primary)',
};

export default function Components() {
  const languagePack = useLanguagePack();

  return (
    <Form onSubmit={values => console.log(values)}>
      <h1>Translation</h1>
      <h2>Using JSX to translate</h2>
      <div>
        <i18n.Translate>Hello this is translated</i18n.Translate>
      </div>

      <div>
        <i18n.Translate>
          Welcome <i18n.Param name="user">Joe</i18n.Param>, how are you doing?
        </i18n.Translate>
      </div>

      <div>
        <i18n.Translate>
          <i18n.Param name="agent" gender="F">
            Cathy
          </i18n.Param>{' '}
          will see you today
        </i18n.Translate>
      </div>

      <div>
        <i18n.Translate>
          There are{' '}
          <i18n.Param name="bottleCount" count={4}>
            4
          </i18n.Param>{' '}
          bottles on the wall
        </i18n.Translate>
      </div>

      <div>
        <i18n.Translate>
          <i18n.Param name="person" gender="M">
            Henry
          </i18n.Param>{' '}
          can eat{' '}
          <i18n.Param name="cookies" count={10}>
            many cookies
          </i18n.Param>{' '}
          before he feels sick.
        </i18n.Translate>
      </div>

      <h2>Using functions to translate</h2>
      <div>
        {i18n.translate`You can also translate with a tagged template`(
          languagePack,
        )}
      </div>
      <div>
        {i18n.translate`Tagged templates take on ${{
          name: 'param',
          value: 'params',
        }} as well.`(languagePack)}
      </div>
      <div>
        {i18n.translate`The params can include ${{
          name: 'gender',
          value: 'gender',
          gender: 'M',
        }} too.`(languagePack)}
      </div>
      <div>
        {i18n.translate`Same with (${{
          name: 'person',
          value: '4',
          count: 4,
        }}) count`(languagePack)}
      </div>

      <h1>Controls</h1>

      <h2>Autocomplete</h2>
      <Autocomplete
        label="example"
        name="autocomplete"
        getItems={inputText =>
          ['Apple', 'Bat', 'Cat', 'Dog', 'Elephant', 'Frog', 'Garden']
            .filter(str =>
              str.toLowerCase().includes((inputText || '').toLowerCase()),
            )
            .map(text => ({ text }))
        }
      />

      <h2>Button - Empty</h2>
      <buttons.Empty>Empty</buttons.Empty>
      <buttons.Empty disabled>Empty</buttons.Empty>

      <h2>Button - Filled</h2>
      <buttons.Filled type="submit">Filled</buttons.Filled>
      <buttons.Filled disabled>Filled</buttons.Filled>

      <h2>Button - Hollow</h2>
      <buttons.Hollow>Hollow</buttons.Hollow>
      <buttons.Hollow disabled>Hollow</buttons.Hollow>

      <h2>Checkbox</h2>
      <Checkbox value={{ text: 'optionA' }} name="checkbox" label="Checkbox" />
      <Checkbox value={{ text: 'optionB' }} name="checkbox" label="Checkbox" />
      <Checkbox value={{ text: 'optionC' }} name="checkbox" label="Checkbox" />
      <Checkbox
        value={{ text: 'optionD' }}
        name="checkbox"
        label="Checkbox"
        disabled
      />

      <h2>Chips - Choice</h2>
      <chips.Choice
        choices={[
          { text: 'Apple' },
          { text: 'Bat' },
          { text: 'Cat' },
          { text: 'Dog' },
          { text: 'Elephant' },
          { text: 'Frog', disabled: true },
          { text: 'Garden' },
        ]}
        name="chips_Choice"
      />

      <h2>Chips - Input</h2>
      <chips.Input
        getChoices={inputText =>
          ['Apple', 'Bat', 'Cat', 'Dog', 'Elephant', 'Frog', 'Garden']
            .filter(str =>
              str.toLowerCase().includes((inputText || '').toLowerCase()),
            )
            .map(text => ({ text }))
        }
        label="input chips"
        name="chips_Input"
      />

      <h2>Chips - Pick</h2>
      <chips.Pick
        choices={[
          { text: 'Apple' },
          { text: 'Bat' },
          { text: 'Cat' },
          { text: 'Dog' },
          { text: 'Elephant' },
          { text: 'Frog', disabled: true },
          { text: 'Garden' },
        ]}
        name="chips_Pick"
      />

      <h2>Datepicker</h2>
      <Datepicker label="datepicker" name="datepicker" />
      <Datepicker label="datepicker" name="datepicker_range" range />

      <h2>Input</h2>
      <Input name="input" label="input" />

      <h2>InputWithValidation</h2>
      <InputWithValidation
        name="input_with_validation"
        label="input"
        onValidate={text =>
          text.startsWith('is valid') ? '' : "text must start with 'is valid'"
        }
      />

      <h2>Link - Empty</h2>
      <links.Empty>Empty</links.Empty>

      <h2>Link - Filled</h2>
      <links.Filled>Filled</links.Filled>

      <h2>Link - Hollow</h2>
      <links.Hollow>Hollow</links.Hollow>

      <h2>Radio</h2>
      <Radio value={{ text: 'optionA' }} name="radio" label="Radio" />
      <Radio value={{ text: 'optionB' }} name="radio" label="Radio" />
      <Radio value={{ text: 'optionC' }} name="radio" label="Radio" />
      <Radio value={{ text: 'optionD' }} name="radio" label="Radio" disabled />

      <h2>Select</h2>
      <Select
        name="select"
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
      >
        {option => <div>{option.text}</div>}
      </Select>

      <h2>Switch</h2>
      <Switch name="switch" />
      <Switch name="switch2" defaultValue />
      <Switch name="switch_disabled" disabled />

      <h1>Icons</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr',
          gridGap: 32,
          alignItems: 'center',
        }}
      >
        <div>Calendar</div>
        <Calendar style={iconStyle} />
        <div>Checkmark</div>
        <Checkmark style={iconStyle} />
        <div>ChevronDown</div>
        <ChevronDown style={iconStyle} />
        <div>ChevronLeft</div>
        <ChevronLeft style={iconStyle} />
        <div>ChevronRight</div>
        <ChevronRight style={iconStyle} />
        <div>ChevronUp</div>
        <ChevronUp style={iconStyle} />
        <div>Close</div>
        <Close style={iconStyle} />
        <div>Google</div>
        <Google style={iconStyle} />
        <div>House</div>
        <House style={iconStyle} />
      </div>

      <h1>Typography</h1>
      <div>
        <T.Body1>Body1</T.Body1>
      </div>
      <div>
        <T.Body2>Body2</T.Body2>
      </div>
      <div>
        <T.Caption>Caption</T.Caption>
      </div>
      <div>
        <T.H1>H1</T.H1>
      </div>
      <div>
        <T.H2>H2</T.H2>
      </div>
      <div>
        <T.H3>H3</T.H3>
      </div>
      <div>
        <T.H4>H4</T.H4>
      </div>
      <div>
        <T.H5>H5</T.H5>
      </div>
      <div>
        <T.H6>H6</T.H6>
      </div>
      <div>
        <T.Overline>Overline</T.Overline>
      </div>
      <div>
        <T.Subtitle1>Subtitle1</T.Subtitle1>
      </div>
      <div>
        <T.Subtitle2>Subtitle2</T.Subtitle2>
      </div>
    </Form>
  );
}
