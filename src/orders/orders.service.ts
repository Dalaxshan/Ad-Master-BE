import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './orders.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  create(adId: string, buyerId: string) {
    return this.orderModel.create({ ad: adId, buyer: buyerId });
  }

  findAll() {
    return this.orderModel.find().populate('ad buyer', '-password');
  }

  async findOne(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('ad buyer', '-password');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  findByUser(userId: string) {
    return this.orderModel.find({ buyer: userId }).populate('ad');
  }

  updatePayment(id: string, status: string) {
    return this.orderModel.findByIdAndUpdate(
      id,
      { payment: status },
      { returnDocument: 'after' },
    );
  }
}
