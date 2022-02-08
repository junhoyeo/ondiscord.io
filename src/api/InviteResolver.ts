import { VercelRequest, VercelResponse } from '@vercel/node';

import { allowCORS } from './_lib/allowCORS';
import { getDiscordInvite } from './_lib/getDiscordInvite';

type APIRequest = VercelRequest & {
  query: {
    inviteId: string;
  };
};

const InviteResolver = async (req: APIRequest, res: VercelResponse) => {
  const inviteId = req.query.inviteId;
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

  res.json({
    name,
    description,
    channel,
    memberCount,
    presenceCount,
    inviteURL,
    iconURL,
    splashURL,
  });
  return;
};

export default allowCORS(InviteResolver);
