import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Post('welcome')
  async welcome(@Body() body: { to: string; name: string }) {
    await this.mailService.sendWelcomeEmail(body.to, body.name);
    return { message: 'Welcome email sent' };
  }

  @Post('approved')
  async approved(@Body() body: { to: string; name: string; url: string }) {
    await this.mailService.sendApprovedEmail(body.to, body.name, body.url);
    return { message: 'Approved email sent' };
  }

  @Post('ad-approved')
  async adApproved(@Body() body: { to: string; name: string; url: string }) {
    await this.mailService.sendApprovedAdEmail(body.to, body.name, body.url);
    return { message: 'Approved ad email sent' };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { to: string; resetUrl: string }) {
    await this.mailService.sendResetPasswordEmail(body.to, body.resetUrl);
    return { message: 'Reset password email sent' };
  }

  @Post('new-order')
  async newOrder(@Body() body: { name: string; orderId: string }) {
    await this.mailService.sendNewOrderEmail(body.name, body.orderId);
    return { message: 'New order email sent' };
  }

  @Post('otp')
  async otp(@Body() body: { to: string; name: string; otp: string }) {
    await this.mailService.sendOtpEmail(body.to, body.name, body.otp);
    return { message: 'OTP email sent' };
  }
}