import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/role-guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body('adId') adId: string, @Req() req) {
    return this.ordersService.create(adId, req.user.userId);
  }

  @Get('my')
  myOrders(@Req() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/payment')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updatePayment(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updatePayment(id, status);
  }
}
