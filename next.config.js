const bundleAnalyzer = require('@next/bundle-analyzer');
const withPlugins = require('next-compose-plugins');
const images = require('next-images');
const offline = require('next-offline');

module.exports = withPlugins([
  [
    offline,
    {
      workboxOpts: {
        swDest: 'workbox-service-worker.js',

        /* changing any value means you'll have to copy over all the defaults  */
        /* next-offline */
        // globPatterns: ['static/**/*'],
        // globDirectory: '.',
        runtimeCaching: [
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'offlineCache',
              expiration: {
                maxEntries: 200,
              },
            },
          },
        ],
      },
    },
  ],
  [images],
  [
    bundleAnalyzer({
      enabled: process.env.ANALYZE === 'true',
    }),
  ],
  {
    images: {
      domains: ['s3.ap-south-1.amazonaws.com'],
    },
  },
]);
