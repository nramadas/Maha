import { render } from '@testing-library/react';
import React from 'react';

import { Empty } from './index';

test('renders', () => {
  const { getByText } = render(<Empty>test</Empty>);
  const buttonElement = getByText(/test/i);
  expect(buttonElement).toBeInTheDocument();
});
