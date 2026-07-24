import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  register(@Body() body) {
    return this.adminService.create(body);
  }

  @Post('login')
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    const result = await this.adminService.login(body);
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    return result;
  }
}
