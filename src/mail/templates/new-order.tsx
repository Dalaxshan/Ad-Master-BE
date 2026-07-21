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

interface NewOrderEmailProps {
  name: string;
  orderId: string;
  total: number;
}

export default function NewOrderEmail({
  name,
  orderId,
  total,
}: NewOrderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New order received</Preview>
      <Body>
        <Container>
          <Heading>Hello, {name}!</Heading>
          <Text>We've received your order with ID: {orderId}</Text>
          <Text>Total amount: ${total.toFixed(2)}</Text>
        </Container>
      </Body>
    </Html>
  );
}
