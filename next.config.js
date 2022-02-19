const withSvgr = require('next-plugin-svgr');

const pick = (obj, keys) =>
  keys.reduce(
    (result, key) => ({
      ...result,
      [key]: obj[key],
    }),
    {},
  );

module.exports = withSvgr({
  reactStrictMode: true,
  experimental: {
    styledComponent: true,
  },
  publicRuntimeConfig: pick(process.env, [
    'ENVIRONMENT', //
    'AMPLITUDE_API_KEY',
  ]),
});
