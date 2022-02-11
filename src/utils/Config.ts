import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const Config = publicRuntimeConfig as {
  ENVIRONMENT: 'debug' | 'development' | 'production';
  AMPLITUDE_API_KEY: string;
};
