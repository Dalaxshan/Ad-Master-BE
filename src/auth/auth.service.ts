import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { OAuth2Client } from 'google-auth-library';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async verifyGoogleToken(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }
    return payload;
  }

  async loginWithGoogle(idToken: string, res: Response) {
    const payload = await this.verifyGoogleToken(idToken);
    const user = await this.usersService.findOrCreateFromGoogle({
      googleId: payload.sub,
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture!,
    });
    const { accessToken, refreshToken } = this.generateToken(
      user._id.toString(),
      user.email,
      user.role,
    );

    return { user, accessToken, refreshToken };
  }

  async register(dto: CreateUserDto, res: Response) {
    if (await this.usersService.findByEmail(dto.email)) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create(dto);
    const { accessToken, refreshToken } = this.generateToken(
      user._id.toString(),
      user.email,
      user.role,
    );
    this.setTokenCookie(res, accessToken, refreshToken);

    await this.mailService
      .sendWelcome(user.email, user.name ?? 'User')
      .catch((e) => {
        console.error('Mail send failed:', e.message);
      });
    return { user: { id: user._id, email: user.email, role: user.role } };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = user.password
      ? await bcrypt.compare(dto.password, user.password)
      : false;
    if (user.isVerified === false)
      throw new UnauthorizedException(
        'Wait for admin to verify your account before logging in',
      );
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const { accessToken, refreshToken } = this.generateToken(
      user._id.toString(),
      user.email,
      user.role,
    );

    //store token in cookie
    this.setTokenCookie(res, accessToken, refreshToken);

    const populated = await user.populate(
      'ads',
      'title description location price images',
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: populated,
    };
  }

  logout(res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      path: '/',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const user = await this.usersService.setResetToken(email, token, expires);

    console.log('User:', user);
    if (user) {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      console.log('Reset URL:', resetUrl);
      await this.mailService.sendResetPassword(
        email,
        user.name ?? 'User',
        resetUrl,
      );
      console.log(
        'Sending reset password email:',
        email,
        user.name ?? 'User',
        resetUrl,
      );
      // .catch((e) => {
      //   console.error('Mail send failed:', e.message);
      // });
    }
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user) throw new BadRequestException('Invalid or expired reset token');
    await this.usersService.changePassword(user._id.toString(), newPassword);
    return { message: 'Password reset successfully' };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const valid = await bcrypt.compare(currentPassword, user.password ?? '');
    if (!valid)
      throw new UnauthorizedException('Current password is incorrect');
    await this.usersService.changePassword(userId, newPassword);
    return { message: 'Password changed successfully' };
  }

  private signToken(sub: string, email: string, role: string) {
    return this.jwtService.sign({ sub, email, role });
  }

  generateToken(userId: string, email: string, role: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email, role },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
    );
    const refreshToken = this.jwtService.sign(
      { sub: userId, email, role },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.generateToken(user._id.toString(), user.email, user.role);
  }

  private setTokenCookie(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
}
