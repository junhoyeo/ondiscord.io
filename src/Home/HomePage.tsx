import dedent from 'dedent';
import Head from 'next/head';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Analytics } from '@/utils/analytics';

const schema = {
  title: 'OnDiscord.io | Discord links with Metadata',
  description:
    "Wrap invite links with Metadata. Three seconds and you're ready to share!",
  url: 'https://ondiscord.io',
  image:
    'https://repository-images.githubusercontent.com/456924203/92a8c5e8-7491-4e44-92d9-87a546e77e56',
};
const HomePage = () => {
  useEffect(() => {
    Analytics.logEvent('view_landing', {});
  }, []);

  return (
    <Container>
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
      </Head>
      <Title>
        Discord links
        <br />
        with Metadata
      </Title>
      <Description>OnDiscord.io - Wrap invite links from Discord</Description>
      <ButtonLinkWrapper
        href="https://github.com/junhoyeo/ondiscord.io"
        target="_blank"
        rel="noreferrer"
      >
        <Button>GitHub</Button>
      </ButtonLinkWrapper>

      <Image
        alt=""
        src="/images/preview.png"
        srcSet={dedent`
          /images/preview.png 1x,
          /images/preview@2x.png 2x
        `}
      />
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  padding-bottom: 60px;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow-x: hidden;

  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;

  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('/images/blurred.jpg');
  z-index: 0;

  &::after {
    content: '';
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;

    background-image: url('/images/noise.png');
    opacity: 0.5;
  }
`;

const Title = styled.h1`
  margin: 0;
  margin-top: 120px;

  font-family: 'Poppins';
  font-weight: 900;
  font-size: 72px;
  line-height: 100%;
  text-align: center;

  background: linear-gradient(180deg, #ffffff -14.93%, #b1b7ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const Description = styled.p`
  margin: 0;
  margin-top: 8px;

  font-family: 'Poppins';
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  color: rgba(255, 255, 255, 0.66);
`;

const ButtonLinkWrapper = styled.a`
  margin-top: 32px;
`;
const Button = styled.button`
  width: 158px;
  height: 52px;

  border: 0;
  outline: 0;
  cursor: pointer;

  background: #52fcff;
  border-radius: 8px;

  font-family: 'Poppins';
  font-weight: 900;
  font-size: 16px;
  line-height: 100%;
  color: #000762;
`;

const Image = styled.img`
  margin-top: 36px;
  -webkit-user-drag: none;
`;
