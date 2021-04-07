import { render } from '@testing-library/react';
import React from 'react';

import { Filled } from './index';

test('renders', () => {
  const { getByText } = render(<Filled>test</Filled>);
  const buttonElement = getByText(/test/i);
  expect(buttonElement).toBeInTheDocument();
});
