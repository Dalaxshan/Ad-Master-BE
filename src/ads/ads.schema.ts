import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdDocument = Ad & Document;

@Schema()
export class BoostAd {
  @Prop() boost: string;
  @Prop() startDate: Date;
  @Prop() endDate: Date;
  @Prop() boostCharge: number;
}

@Schema()
export class PlanAd {
  @Prop() plan: string;
  @Prop() startDate: Date;
  @Prop() endDate: Date;
  @Prop() planCharge: number;
}

@Schema({ timestamps: true })
export class Ad {
  @Prop({ required: true }) title: string;
  @Prop({ required: true, unique: true }) adSlug: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) price: number;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: Types.ObjectId;
  @Prop({ type: [{ url: String, publicId: String }], default: [] }) images: {
    url: string;
    publicId: string;
  }[];
  @Prop() plan: PlanAd;
  @Prop({ type: [BoostAd], default: [] }) boostAds: BoostAd[];
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
  @Prop() categorySlug: string;
  @Prop() subCategorySlug: string;
  @Prop({ enum: ['active', 'inactive', 'pending'], default: 'active' })
  status: string;
}

export const AdSchema = SchemaFactory.createForClass(Ad);
