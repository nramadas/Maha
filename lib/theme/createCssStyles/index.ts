import { createCssVars } from '@/lib/theme/createCssVars';

export function createCssStyles() {
  return `
    body {
      ${Object.entries(createCssVars())
        .map(([name, value]) => `${name}: ${value};`)
        .join('\n')}

      background-color: var(--color-background);
      color: var(--color-onBackground);
      font-family: var(--font-body);
    }

    html,
    body {
      padding: 0;
      margin: 0;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
    }

    * {
      box-sizing: border-box;
    }
  `;
}
