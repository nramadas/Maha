import { render } from '@testing-library/react';
import React from 'react';

import findParent from './index';

test('finds ancestors', () => {
  const testid = 'test';

  const { getByTestId } = render(
    <div>
      <a>
        <span data-testid={testid} />
      </a>
    </div>,
  );

  const el = getByTestId(testid);
  expect(findParent(el, parent => parent.tagName === 'A')).toBeInTheDocument();
});

test('returns null when no ancestor is found', () => {
  const testid = 'test';

  const { getByTestId } = render(
    <div>
      <div>
        <span data-testid={testid} />
      </div>
    </div>,
  );

  const el = getByTestId(testid);
  expect(findParent(el, parent => parent.tagName === 'A')).toBeNull();
});
