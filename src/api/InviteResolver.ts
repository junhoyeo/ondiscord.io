import axios from 'axios';

import { createCanvas, Image } from '@napi-rs/canvas';
import { VercelRequest, VercelResponse } from '@vercel/node';

import { allowCORS } from './_lib/allowCORS';
import { getDiscordInvite } from './_lib/getDiscordInvite';

type APIRequest = VercelRequest & {
  query: {
    inviteId: string;
  };
};

type url = string;
const getBufferFromURL = async (url: url): Promise<Buffer> => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'utf-8');
};

type ImageInput = {
  url: url;
  width: number;
  height: number;
};
const getImageFromURL = async (params: ImageInput) => {
  const img = new Image();
  img.src = await getBufferFromURL(params.url);
  img.width = params.width;
  img.height = params.height;
  return { image: img, ...params };
};
const loadImages = (images: ImageInput[]) =>
  Promise.all(images.map(getImageFromURL));

const InviteResolver = async (req: APIRequest, res: VercelResponse) => {
  const inviteId = req.query.inviteId;
  console.log({ inviteId });
  if (!inviteId) {
    res.status(400).json({ status: 'error', message: 'InviteId not found' });
    return;
  }

  const inviteDetail = await getDiscordInvite(inviteId);

  const name = inviteDetail.guild.name;
  const description = inviteDetail.guild.description;
  const channel = inviteDetail.channel.name;

  const memberCount = inviteDetail.approximate_member_count;
  const presenceCount = inviteDetail.approximate_presence_count;

  const inviteURL = `https://discord.com/invite/${inviteId}`;
  const iconURL = !!inviteDetail.guild.icon
    ? `https://cdn.discordapp.com/icons/${inviteDetail.guild.id}/${inviteDetail.guild.icon}.webp?size=128`
    : null;
  const splashURL = !!inviteDetail.guild.splash
    ? `https://cdn.discordapp.com/splashes/${inviteDetail.guild.id}/${inviteDetail.guild.splash}.jpg?size=4096`
    : null;

  const details = {
    name,
    description,
    channel,
    memberCount,
    presenceCount,
    inviteURL,
    iconURL,
    splashURL,
  };
  const [iconImage, splashImage] = await loadImages([
    { url: details.iconURL, width: 200, height: 200 },
    { url: details.splashURL, width: 1280, height: 640 },
  ]);
  const canvas = createCanvas(1280, 640);

  const context = canvas.getContext('2d');
  context.drawImage(
    splashImage.image,
    0,
    0,
    splashImage.width,
    splashImage.height,
  );

  // prepare clip
  const x = 100;
  const y = 100;
  const radius = iconImage.width / 2;
  const width = iconImage.width;
  const height = iconImage.height;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height,
  );
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.clip();

  // draw and restore context
  context.drawImage(
    iconImage.image,
    x + 5,
    y + 5,
    iconImage.width - 10,
    iconImage.height - 10,
  );
  context.closePath();
  context.restore();

  const buffer = await canvas.encode('png');

  res.statusCode = 200;
  res.setHeader('Content-Type', `image/png`);
  res.setHeader(
    'Cache-Control',
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
  );
  res.end(buffer);
};

export default allowCORS(InviteResolver);
