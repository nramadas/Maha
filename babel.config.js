// @generated: @expo/next-adapter@2.1.61
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#shared-steps

module.exports = function (api) {
  require('dotenv').config({ path: '.env.local' });

  api.cache(true);

  const isWeb = process.env.IS_WEB === 'true';

  return {
    presets: [isWeb ? 'next/babel' : '@expo/next-adapter/babel'],
    plugins: [
      ...(isWeb
        ? [
            'babel-plugin-transform-typescript-metadata',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ]
        : []),
      ...(!isWeb ? ['transform-inline-environment-variables'] : []),
      [
        'module-resolver',
        {
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx',
          ],
          root: ['.'],
          alias: {
            '@': '.',
          },
        },
      ],
    ],
  };
};
