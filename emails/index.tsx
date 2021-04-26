import sgMail from '@sendgrid/mail';
import React, { ComponentProps } from 'react';

import ReactDomServer from 'react-dom/server';
import { ThemeProvider } from 'styled-components';

import { log } from '@/lib/log/server';
import { createColors } from '@/lib/theme/createColors';

import * as templates from './templates';

const THEME = {
  ...createColors(),
  font: 'Arial',
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

type TemplateType = keyof typeof templates;
type Template<T extends TemplateType> = typeof templates[T];

interface Options<T extends TemplateType> {
  to: string;
  template: T;
  props: ComponentProps<Template<T>['Template']>;
}

export function sendEmail<T extends TemplateType>(options: Options<T>) {
  const template = templates[options.template];
  const props = options.props;

  sgMail
    .send({
      from: 'mail@niranjan.me',
      html: ReactDomServer.renderToStaticMarkup(
        <ThemeProvider theme={THEME}>
          <template.Template {...props} />
        </ThemeProvider>,
      ),
      subject: template.subject,
      text: template.rawText,
      to: options.to,
    })
    .then(() =>
      log({
        subject: 'Email sent',
        text: [`To: ${options.to}`, `Template: ${options.template}`],
      }),
    )
    .catch(e =>
      log({ error: true, subject: 'Error sending email', text: e.toString() }),
    );
}
