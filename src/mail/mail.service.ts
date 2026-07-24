import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { render } from '@react-email/components';
import * as React from 'react';
import ResetPasswordEmail from './templates/reset-password';
import OtpEmail from './templates/otp';
import NewOrderEmail from './templates/new-order';
import RegistrationApprovedEmail from './templates/registration-approved';
import AdApprovedEmail from './templates/ad-approved';
import NewRegistrationEmail from './templates/new-registration';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  private async send(to: string, subject: string, element: React.ReactElement) {
    const html = await render(element);
    const result = await this.resend.emails.send({
      from: process.env.MAIL_FROM!,
      to,
      subject,
      html,
    });
    if (result.error) {
      console.error('Resend error:', result.error);
      throw new Error(result.error.message);
    }
    return result;
  }

  sendRegistration(to: string, name: string) {
    return this.send(
      to,
      'New Registration has been received.',
      React.createElement(NewRegistrationEmail, { name }),
    );
  }

  sendOtp(to: string, code: string) {
    return this.send(
      to,
      'Your verification code',
      React.createElement(OtpEmail, { code }),
    );
  }

  sendResetPassword(to: string, name: string, resetUrl: string) {
    return this.send(
      to,
      'Reset your password',
      React.createElement(ResetPasswordEmail, { name, resetUrl }),
    );
  }

  sendNewOrder(
    to: string,
    order: { orderId: string; total: number; seller?: string },
  ) {
    return this.send(
      to,
      `Order #${order.orderId.slice(-6).toUpperCase()}`,
      React.createElement(NewOrderEmail, {
        orderId: order.orderId.slice(-6).toUpperCase(),
        total: order.total,
        seller: order.seller?.slice(-6).toUpperCase(),
      }),
    );
  }

  sendRegistrationApproved(to: string, name: string) {
    return this.send(
      to,
      'Your registration is approved',
      React.createElement(RegistrationApprovedEmail, { name }),
    );
  }

  sendAdApproved(to: string, adTitle: string) {
    return this.send(
      to,
      'Your ad has been approved',
      React.createElement(AdApprovedEmail, { adTitle }),
    );
  }
}
