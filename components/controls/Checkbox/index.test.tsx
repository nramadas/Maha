import { render } from '@testing-library/react';
import React from 'react';

import { Checkbox } from './index';

test('renders', () => {
  const { getByTestId } = render(
    <Checkbox name="test" data-testid="test" value={{ text: 'on' }} />,
  );
  const checkbox = getByTestId('test');
  expect(checkbox).toBeInTheDocument();
});

test('supports a label', () => {
  const { getByText } = render(
    <Checkbox name="test" label="test" value={{ text: 'on' }} />,
  );
  const checkbox = getByText(/test/i);
  expect(checkbox).toBeInTheDocument();
});
