import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const INVITE_LINK_PREFIX = 'https://discord.com/invite/';

const HomePage = () => {
  const [inviteURL, setInviteURL] = useState<string>('');
  const [inviteId, setInviteId] = useState<string>('');
  const [isValidInviteURL, setValidInviteURL] = useState<boolean>(false);

  useEffect(() => {
    if (!inviteURL || !inviteURL.includes(INVITE_LINK_PREFIX)) {
      setInviteId('');
      setValidInviteURL(false);
      return;
    }
    const _inviteId = inviteURL.replace(INVITE_LINK_PREFIX, '').split('/')[0];
    setInviteId(_inviteId);
  }, [inviteURL]);

  const [shareableURL, setShareableURL] = useState<string>('');

  return (
    <Container>
      <FieldContainer>
        <Label>Input Invite URL from Discord</Label>
        <Input
          value={inviteURL}
          onChange={(e) => setInviteURL(e.target.value)}
        />

        {!!inviteURL && !isValidInviteURL && <span>Invalid URL</span>}
      </FieldContainer>
      <FieldContainer>
        <Label>Parsed Invite ID</Label>
        <Input disabled value={inviteId} />
      </FieldContainer>
      <FieldContainer>
        <Label>Generated Link</Label>
        <Input disabled value={shareableURL} />
      </FieldContainer>
    </Container>
  );
};

export default HomePage;

const Container = styled.div``;

const FieldContainer = styled.div`
  padding: 8px;

  display: flex;
  flex-direction: column;

  max-width: 500px;
`;
const Label = styled.span``;
const Input = styled.input``;
