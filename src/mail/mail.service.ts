import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  // Welcome Email
  async sendWelcomeEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to AdMaster!',
      template: 'welcome',           
      context: { name },       
    });
  }

  // Approved Email
  async sendApprovedEmail(to: string, name: string, url: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Your Account has been Approved',
      template: 'registration-approved',           
      context: { name, url },       
    });
  }

  // Reset Password Email
  async sendResetPasswordEmail(to: string, resetUrl: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Reset Your Password',
      template: 'reset-password',     
      context: {resetUrl, expiry: '15 minutes' },
    });
  }

  // Approved Ad
    async sendApprovedAdEmail(to: string, name: string,url: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Your Ad Has Been Approved',
      template: 'ad-approved',           
      context: { name, url },       
    });
  }

  //New Order Email
  async sendNewOrderEmail( name: string, orderId: string) {
    await this.mailerService.sendMail({
      to:'admasterlk1@gmail.com',
      subject: 'New Order Has Been Received',
      template: 'new-order',
      context: { name, orderId },
    });
  }

  // OTP Email
  async sendOtpEmail(to: string, name: string, otp: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Your OTP Code',
      template: 'otp',            
      context: { name, otp, expiry: '5 minutes' },
    });
  }
}