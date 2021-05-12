import { wait } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { Autocomplete } from './index';

const items = (inputText?: string | undefined) =>
  ['Apple', 'Bat', 'Cat', 'Dog', 'Elephant', 'Frog', 'Garden']
    .filter(str => str.toLowerCase().includes((inputText || '').toLowerCase()))
    .map(text => ({ text, value: text }));

const itemsAsync = (
  inputText?: string | undefined,
): Promise<ReturnType<typeof items>> =>
  new Promise(res => {
    setTimeout(() => {
      res(items(inputText));
    }, Math.random() * 1000);
  });

async function testExists(
  getItems: typeof items | typeof itemsAsync,
  select: (input: HTMLElement, item: HTMLElement) => Promise<any>,
) {
  const { getByText, getByTestId } = render(
    <Autocomplete
      data-testid="test"
      getItems={getItems}
      label="test"
      name="test"
    />,
  );
  const input = getByTestId('test');
  const text = 'elep';
  const selection = 'Elephant';

  // type out the text
  await userEvent.type(input, text);
  expect(input).toHaveValue(text);

  // should show a matching result
  let result: HTMLElement;

  await wait(() => {
    result = getByText(selection);
    expect(result).toBeInTheDocument();
  });

  // select the item using the preferred method
  // @ts-ignore
  await select(input, result);

  expect(input).toHaveValue(selection);
}

async function testNotExists(getItems: typeof items | typeof itemsAsync) {
  const { getByText, getByTestId } = render(
    <Autocomplete
      data-testid="test"
      getItems={getItems}
      label="test"
      name="test"
    />,
  );
  const input = getByTestId('test');
  const text = 'asdfg';

  // type out the text
  await userEvent.type(input, text);
  expect(input).toHaveValue(text);

  await wait(() => {
    const error = getByText(`No results matching '${text}'`);
    expect(error).toBeInTheDocument();
  });
}

test('renders', () => {
  const { getByText } = render(
    <Autocomplete getItems={() => []} label="test" name="test" />,
  );
  const input = getByText(/test/i);
  expect(input).toBeInTheDocument();
});

[items, itemsAsync].forEach((getItems, getterIndex) => {
  [
    async (input: HTMLElement) => userEvent.type(input, '{enter}'),
    async (input: HTMLElement) => userEvent.type(input, '{tab}'),
    async (_: HTMLElement, item: HTMLElement) => userEvent.click(item),
  ].forEach((selector, selectorIndex) => {
    test(`test item found, getter: ${getterIndex}, selector: ${selectorIndex}`, () => {
      testExists(getItems, selector);
    });
  });
});

[items, itemsAsync].forEach((getItems, getterIndex) => {
  test(`test item not found, getter: ${getterIndex}`, () => {
    testNotExists(getItems);
  });
});
