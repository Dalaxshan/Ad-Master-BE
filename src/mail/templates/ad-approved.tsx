import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface AdApprovedEmailProps {
  adTitle: string;
}

export default function AdApprovedEmail({ adTitle }: AdApprovedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Ad has been Approved</Preview>
      <Body>
        <Container>
          <Heading>Your ad has been approved!</Heading>
          <Text>The ad "{adTitle}" has been approved and is now live.</Text>
        </Container>
      </Body>
    </Html>
  );
}
