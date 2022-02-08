export type WelcomeChannel = {
  channel_id: string;
  description: string;
  emoji_id?: null;
  emoji_name: string;
};

export type WelcomeScreen = {
  description: string;
  welcome_channels: WelcomeChannel[];
};

export type Guild = {
  id: string;
  name: string;
  splash: string;
  banner: string;
  description?: null;
  icon: string;
  features: string[];
  verification_level: number;
  vanity_url_code: string;
  premium_subscription_count: number;
  welcome_screen: WelcomeScreen;
  nsfw: boolean;
  nsfw_level: number;
};

export type Channel = {
  id: string;
  name: string;
  type: number;
};

export type Inviter = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
};

export type InviteDetail = {
  code: string;
  type: number;
  expires_at?: null;
  guild: Guild;
  channel: Channel;
  inviter: Inviter;
};

export type InviteDetailWithCounts = InviteDetail & {
  approximate_member_count: 19787;
  approximate_presence_count: 100;
};
