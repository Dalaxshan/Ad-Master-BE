import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { User } from './users.schema';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@Req() req, @Body() body) {
    return this.usersService.update(req.user.userId, body);
  }

  @Patch(':id')
  // @UseGuards(RolesGuard)
  // @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Body('isVerified') isVerified: boolean,
  ) {
    return this.usersService.update(id, { isVerified } as Partial<User>);
  }

  @Get()
  @UseGuards(RolesGuard)
  // @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
