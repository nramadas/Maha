import { render } from '@testing-library/react';
import React from 'react';

import { Checkbox } from './index';

test('renders', () => {
  const { getByTestId } = render(<Checkbox name="test" data-testid="test" />);
  const checkbox = getByTestId('test');
  expect(checkbox).toBeInTheDocument();
});

test('supports a label', () => {
  const { getByText } = render(<Checkbox name="test" label="test" />);
  const checkbox = getByText(/test/i);
  expect(checkbox).toBeInTheDocument();
});
