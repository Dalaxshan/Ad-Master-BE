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

interface OtpEmailProps {
  code: string;
}

export default function OtpEmail({ code }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code</Preview>
      <Body>
        <Container>
          <Heading>Your verification code</Heading>
          <Text>The verification code for your account is: {code}</Text>
        </Container>
      </Body>
    </Html>
  );
}
