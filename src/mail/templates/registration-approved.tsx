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

interface RegistrationApprovedEmailProps {
  name: string;
}

export default function RegistrationApprovedEmail({
  name,
}: RegistrationApprovedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Registration Approved</Preview>
      <Body>
        <Container>
          <Heading>Congratulations, {name}!</Heading>
          <Text>Your registration has been approved.</Text>
        </Container>
      </Body>
    </Html>
  );
}
