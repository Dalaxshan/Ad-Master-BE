import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop() name?: string;
  @Prop() address?: string;
  @Prop() district?: string;
  @Prop({ required: true, unique: true }) email!: string;
  @Prop() phoneNumber?: string;
  @Prop({ default: false }) isVerified: boolean;
  @Prop() password?: string;
  @Prop() googleId?: string;
  @Prop() avatar?: string;
  @Prop({ enum: ['local', 'google'], default: 'local' }) provider?: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Ad' }] }) ads?: Types.ObjectId[];
  @Prop({ enum: ['admin', 'seller'], default: 'seller' })
  role!: string;
  @Prop() resetPasswordToken?: string;
  @Prop() resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
