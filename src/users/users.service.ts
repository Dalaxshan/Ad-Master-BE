import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Email already registered');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ ...dto, password: hashed });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).populate('ads');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel
      .find()
      .select('-password')
      .populate('ads', 'title description images price status')
      .exec();
  }

  async update(id: string, data: Partial<User>): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, data, { returnDocument: 'after' })
      .select('-password')
      .exec() as Promise<UserDocument>;
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async setResetToken(email: string, token: string, expires: Date) {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    return user.save();
  }

  async findByResetToken(token: string) {
    return this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  async changePassword(id: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return this.userModel.findByIdAndUpdate(id, {
      password: hashed,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
  }
}
