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
  login(@Body() body, @Res({ passthrough: true }) res: Response) {
    return this.adminService.login(body, res);
  }
}
