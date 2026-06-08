import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(dto: CreateUserDto, res: Response) {
    if (await this.usersService.findByEmail(dto.email)) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create(dto);
    const token = this.signToken(user._id.toString(), user.email, user.role);
    this.setTokenCookie(res, token);
    return { user: { id: user._id, email: user.email, role: user.role } };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (user.isVerified === false)
      throw new UnauthorizedException(
        'Wait for admin to verify your account before logging in',
      );
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.signToken(user._id.toString(), user.email, user.role);
    this.setTokenCookie(res, token);
    return { user: { id: user._id, email: user.email, role: user.role } };
  }

  logout(res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const user = await this.usersService.setResetToken(email, token, expires);
    if (user) await this.mailerService.sendResetPasswordEmail(email, token);
    // always return success to avoid email enumeration
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
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      throw new UnauthorizedException('Current password is incorrect');
    await this.usersService.changePassword(userId, newPassword);
    return { message: 'Password changed successfully' };
  }

  private signToken(sub: string, email: string, role: string) {
    return this.jwtService.sign({ sub, email, role });
  }

  private setTokenCookie(res: Response, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
}
