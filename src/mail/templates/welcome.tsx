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

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform</Preview>
      <Body>
        <Container>
          <Heading>Welcome, {name}!</Heading>
          <Text>We're glad to have you on board.</Text>
        </Container>
      </Body>
    </Html>
  );
}
