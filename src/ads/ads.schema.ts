import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdDocument = Ad & Document;

@Schema()
export class BoostAd {
  @Prop() plan: string;
  @Prop() startDate: Date;
  @Prop() endDate: Date;
  @Prop() amount: number;
}

@Schema({ timestamps: true })
export class Ad {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) price: number;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: Types.ObjectId;
  @Prop({ type: [{ url: String, publicId: String }], default: [] }) images: {
    url: string;
    publicId: string;
  }[];
  @Prop() plan: string;
  @Prop({ type: [BoostAd], default: [] }) boostAd: BoostAd[];
  @Prop({ default: 0 }) totalAmount: number;
  @Prop() location: string;
  @Prop() district: string;
  @Prop({
    enum: [
      'Vehicles',
      'Property',
      'Electronics',
      'Jobs',
      'Services',
      'Home & Garden',
      'Animals & Pets',
      'Business',
      'Fashion & Beauty',
      'Education',
      'Food & Agriculture',
      'Others',
    ],
    required: true,
  })
  category: string;
  @Prop() subcategory: string;
  @Prop({ enum: ['active', 'inactive', 'pending'], default: 'active' })
  status: string;
}

export const AdSchema = SchemaFactory.createForClass(Ad);
