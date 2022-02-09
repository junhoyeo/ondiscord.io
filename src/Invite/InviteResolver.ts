import fs from 'fs';
import path, { join } from 'path';

import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { VercelRequest, VercelResponse } from '@vercel/node';

import { allowCORS } from './middlewares/allowCORS';
import { getDiscordInvite } from './sdk/getDiscordInvite';
import { fillMultiLineText, wrapIntoLines } from './utils/canvas';
import { getImages } from './utils/image';

type APIRequest = VercelRequest & {
  query: {
    inviteId: string;
  };
};

const dir = path.resolve('./public', 'fonts');
GlobalFonts.register(fs.readFileSync(join(dir, 'Poppins-ExtraBold.ttf')));
GlobalFonts.register(fs.readFileSync(join(dir, 'Poppins-SemiBold.ttf')));
GlobalFonts.register(fs.readFileSync(join(dir, 'NotoColorEmoji.ttf')));

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

  const memberCount = inviteDetail.approximate_member_count;
  const presenceCount = inviteDetail.approximate_presence_count;

  const iconURL = !!inviteDetail.guild.icon
    ? `https://cdn.discordapp.com/icons/${inviteDetail.guild.id}/${inviteDetail.guild.icon}.webp?size=128`
    : null;
  const splashURL = !!inviteDetail.guild.splash
    ? `https://cdn.discordapp.com/splashes/${inviteDetail.guild.id}/${inviteDetail.guild.splash}.jpg?size=4096`
    : null;

  const [iconImage, splashImage] = await getImages([
    { url: iconURL, width: 200, height: 200 },
    { url: splashURL, width: 1280, height: 640 },
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

  context.font = '800 92px Poppins, Noto Color Emoji';
  context.fillStyle = 'white';
  context.shadowColor = 'rgba(0, 0, 0, 0.45)';
  context.shadowBlur = 24;
  context.fillText(name, 100, 370);

  context.font = '600 32px Poppins, Noto Color Emoji';
  context.fillStyle = 'white';
  context.shadowColor = 'rgba(0, 0, 0, 0.85)';
  context.shadowBlur = 16;

  const lines = wrapIntoLines(context, description, canvas.width - 200);
  const statistics = `${presenceCount.toLocaleString()} Online / ${memberCount.toLocaleString()} Members`;
  lines.push(statistics);
  fillMultiLineText(context, lines, 100, 440, 1.45);

  const buffer = await canvas.encode('png');

  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/png');
  res.setHeader(
    'Cache-Control',
    'public, no-transform, s-maxage=86400, max-age=86400',
  );
  res.end(buffer);
};

export default allowCORS(InviteResolver);
