import axios from 'axios';

import { InviteDetailWithCounts } from './discord';

export const getDiscordInvite = async (inviteId: string) => {
  const API_URL = `https://discord.com/api/v9/invites/${inviteId}?with_counts=true`;
  try {
    const { data } = await axios.get<InviteDetailWithCounts>(API_URL);
    return data;
  } catch (err) {
    return err;
  }
};
