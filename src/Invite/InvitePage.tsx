import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import { getDiscordInvite } from '@/api/_lib/getDiscordInvite';

type Props = {
  details: {
    title: string;
    description: string;
  };
  OGImageURL: string;
};

export default function ImagePage({ details, OGImageURL }: Props) {
  return (
    <React.Fragment>
      <Head>
        <title>{details.title}</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={details.title} />
        <meta name="twitter:description" content={details.description} />
        <meta name="twitter:image" content={OGImageURL} />
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
  const invite = await getDiscordInvite(params.inviteId);
  const title = invite.guild.name ?? '';

  let description: string = invite.guild.description ?? '';
  if (!!description) {
    description += ' | ';
  }
  const [presenceCount, memberCount] = [
    invite.approximate_presence_count,
    invite.approximate_member_count,
  ].map((v) => v.toLocaleString());
  description += `${presenceCount} Online / ${memberCount} Members`;

  console.log(title, description);

  return {
    props: {
      details: { title, description },
      OGImageURL: `/api/invite/${params.inviteId}`,
    },
  };
};
