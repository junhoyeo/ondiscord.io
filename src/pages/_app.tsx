import Head from 'next/head';
import React from 'react';

import { GlobalStyle } from '@/components/GlobalStyle';
import { Analytics } from '@/utils/analytics';
import { createTheme, NextUIProvider } from '@nextui-org/react';

Analytics.initialize();

const darkTheme = createTheme({
  type: 'dark',
});

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <GlobalStyle />
      </Head>
      <NextUIProvider theme={darkTheme}>
        <Component {...pageProps} />
      </NextUIProvider>
    </React.Fragment>
  );
}

export default MyApp;
