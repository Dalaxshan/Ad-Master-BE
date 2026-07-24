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

interface NewOrderEmailProps {
  orderId: string;
  total: number;
  seller?: string;
}

export default function NewOrderEmail({
  orderId,
  total,
  seller,
}: NewOrderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Order has been Received</Preview>
      <Body>
        <Container>
          <Heading>Hi there!</Heading>
          <Text>
            We've received new order with Order ID: #{orderId} placed by Buyer:
            #{seller}
          </Text>
          <Text>Total amount: LKR {total.toFixed(2)}</Text>

          <Button
            href="https://admin.admasterlk.com/dashboard/orders"
            style={{
              backgroundColor: '#012f6b',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            Go to Admin Panel
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
