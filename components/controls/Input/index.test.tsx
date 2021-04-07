import { render } from '@testing-library/react';
import React from 'react';

import { Checkmark } from '@/components/icons/Checkmark';

import { Input } from './index';

test('renders', () => {
  const { getByText } = render(<Input name="test" label="test" />);
  const input = getByText(/test/i);
  expect(input).toBeInTheDocument();
});

test('supports displaying an icon', () => {
  const { getByText, getByTestId } = render(
    <Input name="test" icon={<Checkmark data-testid="icon" />} label="test" />,
  );
  const input = getByText(/test/i);
  const check = getByTestId('icon');
  expect(input).toBeInTheDocument();
  expect(check).toBeInTheDocument();
});
