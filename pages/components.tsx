import React from 'react';

import { Autocomplete } from '@/components/controls/Autocomplete';
import * as buttons from '@/components/controls/buttons';
import { Checkbox } from '@/components/controls/Checkbox';
import * as chips from '@/components/controls/chips';
import { Datepicker } from '@/components/controls/Datepicker';
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
import { Home } from '@/components/icons/Home';

import * as T from '@/components/typography';

const iconStyle = {
  height: 40,
  width: 40,
  fill: 'var(--color-onPrimary)',
};

export default function Components() {
  return (
    <div>
      <h1>Controls</h1>

      <h2>Autocomplete</h2>
      <Autocomplete
        label="example"
        name="example"
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
      <buttons.Filled>Filled</buttons.Filled>
      <buttons.Filled disabled>Filled</buttons.Filled>

      <h2>Button - Hollow</h2>
      <buttons.Hollow>Hollow</buttons.Hollow>
      <buttons.Hollow disabled>Hollow</buttons.Hollow>

      <h2>Checkbox</h2>
      <Checkbox name="checkbox" label="Checkbox" />
      <Checkbox name="checkbox" label="Checkbox" />
      <Checkbox name="checkbox" label="Checkbox" />
      <Checkbox name="checkbox" label="Checkbox" disabled />

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
        name="choice"
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
        name="input"
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
        name="choice"
      />

      <h2>Datepicker</h2>
      <Datepicker label="datepicker" name="datepicker" />
      <Datepicker label="datepicker" name="datepicker" range />

      <h2>Input</h2>
      <Input name="input" label="input" />

      <h2>InputWithValidation</h2>
      <InputWithValidation
        name="input"
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
      <Radio name="radio" label="Radio" />
      <Radio name="radio" label="Radio" />
      <Radio name="radio" label="Radio" />
      <Radio name="radio" label="Radio" disabled />

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
      <Switch name="switch" disabled />

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
        <div>Home</div>
        <Home style={iconStyle} />
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
    </div>
  );
}
