import { fireEvent, wait } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { InputWithValidation } from './index';

async function runValidationTest(
  testText: string,
  errorText: string,
  validator: (text: string) => string | Promise<string>,
) {
  const inputText = 'asdf';

  const { getByText, getByTestId, queryByText } = render(
    <InputWithValidation
      name="test"
      data-testid={testText}
      label={testText}
      onValidate={validator}
    />,
  );
  const input = getByTestId(testText);

  // type out an incorrect value in the input
  await userEvent.type(input, inputText);
  expect(input).toHaveValue(inputText);

  // the input should not validate until a blur occurs
  const error = queryByText(errorText);
  expect(error).toBeNull();

  // after the first blur, make sure the error text appears
  fireEvent.blur(input);

  await wait(() => {
    const error = getByText(errorText);
    expect(error).toBeInTheDocument();
  });

  // now, fix the input value
  await userEvent.type(input, testText);

  // ensure that the error message goes away, even if the input is not blurred
  await wait(() => {
    const error = queryByText(errorText);
    expect(error).toBeNull();
  });

  // from now on, the validation should be immediate, so if the input value
  // becomes invalid, the error text should reappear
  fireEvent.input(input, { target: { value: inputText } });

  await wait(() => {
    const error = getByText(errorText);
    expect(error).toBeInTheDocument();
  });
}

test('renders', () => {
  const { getByText } = render(
    <InputWithValidation name="test" label="test" />,
  );
  const input = getByText(/test/i);
  expect(input).toBeInTheDocument();
});

test('supports synchronous validation', async () => {
  const testText = 'test';
  const errorText = `Text must contain the word '${testText}'`;

  await runValidationTest(testText, errorText, text =>
    text.includes(testText) ? '' : errorText,
  );
});

test('supports asynchronous validation', async () => {
  const testText = 'test';
  const errorText = `Text must contain the word '${testText}'`;

  await runValidationTest(
    testText,
    errorText,
    text =>
      new Promise(res => {
        setTimeout(() => {
          if (text.includes(testText)) {
            res('');
          } else {
            res(`Text must contain the word '${testText}'`);
          }
        }, Math.random() * 1000);
      }),
  );
});
