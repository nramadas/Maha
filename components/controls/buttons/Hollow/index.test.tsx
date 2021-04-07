import { render } from '@testing-library/react';
import React from 'react';

import { Hollow } from './index';

test('renders', () => {
  const { getByText } = render(<Hollow>test</Hollow>);
  const buttonElement = getByText(/test/i);
  expect(buttonElement).toBeInTheDocument();
});
