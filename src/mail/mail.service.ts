import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private from: string;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    this.from = this.config.get<string>('MAIL_FROM') ?? 'no-reply@admasterlk.com';
  }

  private send(to: string | string[], subject: string, html: string) {
    return this.resend.emails.send({ from: this.from, to, subject, html });
  }

  async sendWelcomeEmail(to: string, name: string) {
    await this.send(to, 'Welcome to AdMaster!', `
      <!DOCTYPE html><html><head><style>
        body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0}
        .container{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden}
        .logo-bar{background:#fff;padding:20px;text-align:center;border-bottom:1px solid #eee}
        .logo-bar img{height:80px;width:auto}
        .header{background:#059669;color:white;padding:20px;text-align:center}
        .body{padding:30px 20px;color:#333}
        .status-box{background:#ECFDF5;border-left:4px solid #059669;border-radius:6px;padding:16px 20px;margin:24px 0}
        .status-box p{margin:0;font-size:14px;color:#065F46}
        .footer{text-align:center;color:#999;font-size:12px;margin-top:30px}
      </style></head><body>
        <div class="container">
          <div class="logo-bar"><img src="https://pub-99e17fed1d7345978ebaceb328549b8f.r2.dev/logo.png" alt="AdMaster Logo"/></div>
          <div class="header"><h1>Welcome to AdMaster!</h1></div>
          <div class="body">
            <h2>Hi ${name},</h2>
            <div class="status-box"><h3><strong>⏳ Pending Approval</strong></h3>
              <p>Your registration is currently under review. We'll notify you by email as soon as your account is approved.</p>
            </div>
          </div>
          <div class="footer"><p>© 2026 <a href="https://admasterlk.com">Admasterlk.com</a>. All rights reserved.</p></div>
        </div>
      </body></html>`);
  }

  async sendApprovedEmail(to: string, name: string, url: string) {
    await this.send(to, 'Your Account has been Approved', `
      <!DOCTYPE html><html><head><style>
        body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0}
        .container{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden}
        .logo-bar{background:#fff;padding:20px;text-align:center;border-bottom:1px solid #eee}
        .logo-bar img{height:80px;width:auto}
        .header{background:#4F46E5;color:white;padding:20px;text-align:center}
        .body{padding:30px 20px;color:#333}
        .button{display:inline-block;padding:12px 30px;background:#4F46E5;color:white;text-decoration:none;border-radius:5px;margin-top:20px}
        .footer{text-align:center;color:#999;font-size:12px;margin-top:30px}
      </style></head><body>
        <div class="container">
          <div class="logo-bar"><img src="https://pub-99e17fed1d7345978ebaceb328549b8f.r2.dev/logo.png" alt="AdMaster Logo"/></div>
          <div class="header"><h1>Welcome to AdMaster!</h1></div>
          <div class="body">
            <h2>Hi ${name},</h2>
            <p>Your account has been approved.</p>
            <p>Click the button below to get started:</p>
            <a href="${url}" class="button">Get Started</a>
          </div>
          <div class="footer"><p>© 2026 <a href="https://www.admasterlk.com">Admasterlk.com</a>. All rights reserved.</p></div>
        </div>
      </body></html>`);
  }

  async sendResetPasswordEmail(to: string, resetUrl: string) {
    await this.send(to, 'Reset Your Password', `
      <!DOCTYPE html><html><head><style>
        body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0}
        .container{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden}
        .logo-bar{background:#fff;padding:20px;text-align:center;border-bottom:1px solid #eee}
        .logo-bar img{height:80px;width:auto}
        .header{background:#DC2626;color:white;padding:20px;text-align:center}
        .body{padding:30px 20px;color:#333}
        .button{display:inline-block;padding:12px 30px;background:#DC2626;color:white;text-decoration:none;border-radius:5px;margin-top:20px}
        .warning{color:#DC2626;font-size:13px;margin-top:15px}
        .footer{text-align:center;color:#999;font-size:12px;margin-top:30px}
      </style></head><body>
        <div class="container">
          <div class="logo-bar"><img src="https://pub-99e17fed1d7345978ebaceb328549b8f.r2.dev/logo.png" alt="AdMaster Logo"/></div>
          <div class="header"><h1>Password Reset Request</h1></div>
          <div class="body">
            <h2>Hello,</h2>
            <p>We received a request to reset your password. Click the link below:</p>
            <a href="https://www.admasterlk.com/reset-password?token=${resetUrl}" class="button">Reset Password</a>
            <p class="warning">⚠️ This link expires in <strong>15 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer"><p>© 2026 <a href="https://www.admasterlk.com">Admasterlk.com</a>. All rights reserved.</p></div>
        </div>
      </body></html>`);
  }

  async sendApprovedAdEmail(to: string, name: string, url: string) {
    await this.send(to, 'Your Ad Has Been Approved', `
      <!DOCTYPE html><html><head><style>
        body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0}
        .container{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden}
        .logo-bar{background:#fff;padding:20px;text-align:center;border-bottom:1px solid #eee}
        .logo-bar img{height:80px;width:auto}
        .header{background:#02005a96;color:white;padding:20px;text-align:center}
        .body{padding:30px 20px;color:#333}
        .button{display:inline-block;padding:12px 30px;background:#02005a96;color:white;text-decoration:none;border-radius:5px;margin-top:20px}
        .footer{text-align:center;color:#999;font-size:12px;margin-top:30px}
      </style></head><body>
        <div class="container">
          <div class="logo-bar"><img src="https://pub-99e17fed1d7345978ebaceb328549b8f.r2.dev/logo.png" alt="AdMaster Logo"/></div>
          <div class="header"><h1>Your Ad Has Been Approved</h1></div>
          <div class="body">
            <h2>Hi ${name},</h2>
            <p>Your ad has been approved.</p>
            <p>Click the button below to view your ad:</p>
            <a href="${url}" class="button">View Ad</a>
          </div>
          <div class="footer"><p>© 2026 <a href="https://www.admasterlk.com">Admasterlk.com</a>. All rights reserved.</p></div>
        </div>
      </body></html>`);
  }

  async sendNewOrderEmail(name: string, orderId: string) {
    await this.send('admasterlk1@gmail.com', 'New Order Has Been Received', `
      <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><style>
        body{margin:0;padding:0;width:100%;background-color:#F0EEF7;font-family:Arial,Helvetica,sans-serif}
      </style></head>
      <body style="margin:0;padding:0;background-color:#F0EEF7;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F0EEF7;">
          <tr><td align="center" style="padding:40px 16px;">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
              style="width:600px;max-width:600px;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(20,16,74,0.08);">
              <tr><td align="center" style="background-color:#FFFFFF;padding:28px 20px 20px 20px;">
                <img src="https://pub-99e17fed1d7345978ebaceb328549b8f.r2.dev/logo.png" alt="AdMaster" style="display:block;height:80px;width:auto;"/>
              </td></tr>
              <tr><td style="padding:0 40px;"><div style="border-top:1px solid #ECE9F5;font-size:0;line-height:0;">&nbsp;</div></td></tr>
              <tr><td align="center" style="background-color:#14104A;padding:36px 40px 32px 40px;">
                <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:#8B85D6;font-weight:bold;">New Order</p>
                <p style="margin:0;font-size:34px;line-height:1.2;color:#FFFFFF;font-weight:bold;">#${orderId}</p>
              </td></tr>
              <tr><td style="padding:36px 40px 8px 40px;">
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#1F1B4D;">Hi there,</p>
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#5B5580;">A new order has just come in. Here are the details:</p>
              </td></tr>
              <tr><td style="padding:0 40px 8px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                  style="background-color:#F6F5FC;border:1px solid #E9E6F7;border-radius:12px;">
                  <tr><td style="padding:20px 24px;">
                    <p style="margin:0 0 4px 0;font-size:13px;color:#8A84B3;">Order ID</p>
                    <p style="margin:0 0 14px 0;font-size:16px;color:#1F1B4D;font-weight:bold;">#${orderId}</p>
                    <div style="border-top:1px dashed #D9D4EE;padding-top:14px;">
                      <p style="margin:0 0 4px 0;font-size:13px;color:#8A84B3;">Placed by</p>
                      <p style="margin:0;font-size:16px;color:#1F1B4D;font-weight:bold;">${name}</p>
                    </div>
                  </td></tr>
                </table>
              </td></tr>
              <tr><td align="center" style="padding:32px 40px 40px 40px;">
                <a href="https://admin.admasterlk.com/dashboard/orders" target="_blank"
                  style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:8px;background-color:#FF6B4A;">View Order</a>
              </td></tr>
            </table>
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
              <tr><td align="center" style="padding:24px 20px 0 20px;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#A6A1C7;">© 2026 <a href="https://www.admasterlk.com" style="color:#8A84B3;">Admasterlk.com</a>. All rights reserved.</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body></html>`);
  }

  async sendOtpEmail(to: string, name: string, otp: string) {
    await this.send(to, 'Your OTP Code', `
      <!DOCTYPE html><html><head><style>
        body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0}
        .container{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;padding:40px}
        .header{background:#059669;color:white;padding:20px;border-radius:8px 8px 0 0;text-align:center}
        .body{padding:30px 20px;color:#333}
        .otp-box{font-size:40px;font-weight:bold;letter-spacing:10px;color:#059669;text-align:center;padding:20px;background:#f0fff4;border-radius:8px;margin:20px 0}
        .footer{text-align:center;color:#999;font-size:12px;margin-top:30px}
      </style></head><body>
        <div class="container">
          <div class="header"><h1>Your OTP Code</h1></div>
          <div class="body">
            <h2>Hi ${name},</h2>
            <p>Your one-time password is:</p>
            <div class="otp-box">${otp}</div>
            <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
          </div>
          <div class="footer"><p>© 2026 Admasterlk.com. All rights reserved.</p></div>
        </div>
      </body></html>`);
  }
}