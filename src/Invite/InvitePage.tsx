import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect } from 'react';

import { Analytics } from '@/utils/analytics';

import { getDiscordInvite } from './sdk/getDiscordInvite';

const ROOT_URL = 'https://ondiscord.io';

type Props = {
  details: {
    title: string;
    description: string;
  };
  inviteId: string;
  inviteURL: string;
  OGImageURL: string;
};

export default function ImagePage({ details, OGImageURL, ...props }: Props) {
  useEffect(() => {
    const redirect = () => {
      window.location.href = props.inviteURL;
    };
    Analytics.logEvent('view_invite', {
      invite_id: props.inviteId,
    }) //
      .then(redirect)
      .catch(redirect);
  }, [props]);

  return (
    <React.Fragment>
      <Head>
        <title>{details.title}</title>
        <meta name="description" content={details.description} />

        <meta property="og:title" content={details.title} />
        <meta property="og:description" content={details.description} />
        <meta property="og:image" content={OGImageURL} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={details.title} />
        <meta name="twitter:description" content={details.description} />
        <meta name="twitter:image" content={OGImageURL} />

        <noscript>
          <meta httpEquiv="refresh" content={`0; url=${props.inviteURL}`} />
        </noscript>
      </Head>
    </React.Fragment>
  );
}

type Params = ParsedUrlQuery & {
  inviteId: string;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  params,
}) => {
  const invite = await getDiscordInvite(params.inviteId).catch(() => null);
  if (!invite) {
    return { notFound: true };
  }

  const title = `${invite.guild.name ?? 'Unknown'} | Discord`;

  let description: string = invite.guild.description ?? '';
  if (!!description) {
    description += ' | ';
  }
  const [presenceCount, memberCount] = [
    invite.approximate_presence_count,
    invite.approximate_member_count,
  ].map((v) => v.toLocaleString());
  description += `${presenceCount} Online / ${memberCount} Members`;

  return {
    props: {
      details: { title, description },
      inviteId: params.inviteId,
      inviteURL: `https://discord.com/invite/${params.inviteId}`,
      OGImageURL: `${ROOT_URL}/api/invite/${params.inviteId}`,
    },
  };
};
