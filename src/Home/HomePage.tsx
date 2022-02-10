import Head from 'next/head';
import React, { useEffect } from 'react';

const schema = {
  title: 'OnDiscord.io',
  description: 'Discord links with Metadata',
  url: 'https://ondiscord.io',
  image:
    'https://repository-images.githubusercontent.com/456924203/92a8c5e8-7491-4e44-92d9-87a546e77e56',
};
const HomePage = () => {
  useEffect(() => {
    window.location.href = 'https://github.com/junhoyeo/ondiscord.io';
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>{schema.title}</title>
        <meta name="description" content={schema.description} />

        <meta property="og:title" content={schema.title} />
        <meta property="og:description" content={schema.description} />
        <meta property="og:image" content={schema.image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={schema.title} />
        <meta name="twitter:description" content={schema.description} />
        <meta name="twitter:image" content={schema.image} />

        <meta name="canonical" content={schema.url} />
        <link rel="canonical" href={schema.url} />

        <noscript>
          <meta
            httpEquiv="refresh"
            content={`0; url=${'https://github.com/junhoyeo/ondiscord.io'}`}
          />
        </noscript>
      </Head>
    </React.Fragment>
  );
};

export default HomePage;
