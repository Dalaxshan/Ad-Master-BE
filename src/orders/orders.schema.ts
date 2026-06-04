import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Ad', required: true }) ad: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyer: Types.ObjectId;
  @Prop({
    enum: ['verified', 'notVerified', 'cancelled'],
    default: 'notVerified',
  })
  payment: string;
  @Prop({ default: Date.now }) orderDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
