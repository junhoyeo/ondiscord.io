const withSvgr = require('next-plugin-svgr');

module.exports = withSvgr({
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://github.com/junhoyeo/ondiscord.io',
        permanent: false,
      },
    ];
  },
});
