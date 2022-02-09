import axios from 'axios';
import fs from 'fs';
import path, { join } from 'path';

import { createCanvas, GlobalFonts, Image } from '@napi-rs/canvas';
import { VercelRequest, VercelResponse } from '@vercel/node';

import { allowCORS } from './_lib/allowCORS';
import { getDiscordInvite } from './_lib/getDiscordInvite';

type APIRequest = VercelRequest & {
  query: {
    inviteId: string;
  };
};

const dir = path.resolve('./public', 'fonts');
GlobalFonts.register(fs.readFileSync(join(dir, 'Poppins-ExtraBold.ttf')));
GlobalFonts.register(fs.readFileSync(join(dir, 'Poppins-SemiBold.ttf')));

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
  const _description = inviteDetail.guild.description;
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
    description: _description,
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

  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (!!splashImage) {
    context.drawImage(
      splashImage.image,
      0,
      0,
      splashImage.width,
      splashImage.height,
    );
  }

  context.save();
  const x = 100;
  const y = 70;
  context.beginPath();
  context.arc(
    iconImage.width / 2 + x,
    iconImage.width / 2 + y,
    iconImage.width / 2,
    0,
    Math.PI * 2,
  );
  context.fill();
  context.clip();
  context.drawImage(iconImage.image, x, y, iconImage.width, iconImage.height);
  context.closePath();
  context.restore();

  context.font = '800 92px Poppins';
  context.fillStyle = 'white';
  context.shadowColor = 'rgba(0, 0, 0, 0.45)';
  context.shadowBlur = 24;
  context.fillText(details.name, 100, 370);

  context.font = '600 32px Poppins';
  context.fillStyle = 'white';
  context.shadowColor = 'rgba(0, 0, 0, 0.85)';
  context.shadowBlur = 16;

  let description: string = details.description ?? '';
  if (!!description) {
    description += ' | ';
  }
  description += `${details.presenceCount.toLocaleString()} Online / ${details.memberCount.toLocaleString()} Members`;

  context.fillText(description, 100, 460);

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
