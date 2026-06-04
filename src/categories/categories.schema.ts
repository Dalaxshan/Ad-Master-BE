import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Subcategory {
  @Prop({ required: true }) subcategoryName: string;
  @Prop({ required: true }) subcategorySlug: string;
}

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true }) categoryName: string;
  @Prop({ required: true, unique: true }) categorySlug: string;
  @Prop({ type: [Subcategory], default: [] }) subcategory: Subcategory[];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Ad' }], default: [] }) ads: Types.ObjectId[];
  @Prop({ required: true }) standardRate: number;
  @Prop({ required: true }) premiumRate: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
