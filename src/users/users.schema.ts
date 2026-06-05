import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop() address?: string;
  @Prop() district?: string;
  @Prop({ required: true, unique: true }) email!: string;
  @Prop({ required: true }) phoneNumber: string;
  @Prop({ default: false }) isVerified: boolean;
  @Prop({ required: true }) password: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Ad' }] }) ads?: Types.ObjectId[];
  @Prop({ enum: ['admin', 'seller', 'customer'], default: 'seller' })
  role!: string;
  @Prop() resetPasswordToken?: string;
  @Prop() resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
