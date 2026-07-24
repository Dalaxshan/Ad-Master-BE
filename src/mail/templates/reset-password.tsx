import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export default function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset Your Password</Preview>
      <Body>
        <Container>
          <Heading>Reset Your Password</Heading>
          <Text>Hello, {name}!</Text>
          <Text>
            You have requested to reset your password. Click the link below to
            proceed:
          </Text>
          <Button
            style={{
              backgroundColor: '#012f6b',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
            href={resetUrl}
          >
            Reset Password
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
