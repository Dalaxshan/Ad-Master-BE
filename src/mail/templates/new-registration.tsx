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

interface WelcomeEmailProps {
  name: string;
}

export default function NewRegistrationEmail({
  name,
}: WelcomeEmailProps): React.ReactElement {
  return (
    <Html>
      <Head />
      <Preview>New Registration has been Received!</Preview>
      <Body>
        <Container>
          <Heading>New Registration Has Been Received from {name}!</Heading>
          <Button
            href="https://admin.admasterlk.com/dashboard/sellers"
            style={{
              backgroundColor: '#012f6b',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            View Seller
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
