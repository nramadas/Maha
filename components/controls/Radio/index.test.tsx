import { render } from '@testing-library/react';
import React from 'react';

import { Radio } from './index';

test('renders', () => {
  const { getByTestId } = render(<Radio name="test" data-testid="test" />);
  const radio = getByTestId('test');
  expect(radio).toBeInTheDocument();
});

test('supports a label', () => {
  const { getByText } = render(<Radio name="test" label="test" />);
  const radio = getByText(/test/i);
  expect(radio).toBeInTheDocument();
});
