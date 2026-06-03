import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdDocument = Ad & Document;

export class BoostAd {
  boost: string;
  startDate: Date;
  endDate: Date;
  boostCharge: number;
}

export class PlanAd {
  plan: string;
  startDate: Date;
  endDate: Date;
  planCharge: number;
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
  @Prop({
    type: {
      plan: String,
      startDate: Date,
      endDate: Date,
      planCharge: Number,
    },
  })
  plan: PlanAd;

  @Prop({
    type: [
      {
        boost: String,
        startDate: Date,
        endDate: Date,
        boostCharge: Number,
      },
    ],
    default: [],
  })
  boostAds: BoostAd[];
  @Prop({ default: 0 }) totalAmount: number;
  @Prop() location: string;
  @Prop() district: string;
  @Prop({
    required: true,
  })
  category: string;
  @Prop() subcategory: string;
  @Prop() categorySlug: string;
  @Prop() subCategorySlug: string;
  @Prop({ enum: ['active', 'inactive', 'pending'], default: 'pending' })
  status: string;
}

export const AdSchema = SchemaFactory.createForClass(Ad);
