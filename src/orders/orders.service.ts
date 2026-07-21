import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './orders.schema';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private mailService: MailService,
  ) {}

  async create(adId: string, buyerId: string) {
    const order = await (
      await this.orderModel.create({ ad: adId, buyer: buyerId })
    ).populate('buyer ad');
    await this.mailService.sendNewOrder((order.buyer as any).email, {
      orderId: order.id,
      total: (order.ad as any).price,
    });
    return order;
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

  findByIdAndDeleteByAdId(adId: string) {
    console.log('Ad Id:', adId);
    return this.orderModel.deleteMany({ ad: adId });
  }
}
