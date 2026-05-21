import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  register(@Body() body) {
    return this.adminService.create(body);
  }

  @Post('login')
  login(@Body() body) {
    return this.adminService.login(body);
  }
}
