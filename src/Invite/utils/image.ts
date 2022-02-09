import axios from 'axios';

import { Image } from '@napi-rs/canvas';

type url = string;
const getBufferFromURL = async (url: url): Promise<Buffer> => {
  if (url.startsWith('data:image/')) {
    return Buffer.from(url, 'utf-8');
  }
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'utf-8');
};

type ImageInput = {
  url: url | null;
  width: number;
  height: number;
};
const getImageFromURL = async (params: ImageInput) => {
  if (!params.url) {
    return null;
  }
  const img = new Image();
  img.src = await getBufferFromURL(params.url);
  img.width = params.width;
  img.height = params.height;
  return { image: img, ...params };
};
export const getImages = (images: ImageInput[]) =>
  Promise.all(images.map(getImageFromURL));
