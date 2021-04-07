import 'setimmediate';
import Document from 'next/document';
import React from 'react';

import { createCssStyles } from '@/lib/theme/createCssStyles';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style dangerouslySetInnerHTML={{ __html: createCssStyles() }} />
        </>
      ),
    };
  }
}
