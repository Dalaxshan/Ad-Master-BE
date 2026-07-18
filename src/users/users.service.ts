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
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('Email already registered');
    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    const user = new this.userModel(data);
    return user.save();
  }

  async createFromGoogle(dto: CreateUserDto): Promise<UserDocument> {
    const exists = await this.userModel.findOne({ googleId: dto.googleId });
    if (exists) throw new ConflictException('Google ID already registered');
    const user = new this.userModel(dto);
    return user.save();
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId });
  }

  async findOrCreateFromGoogle(payload: {
    googleId: string;
    email: string;
    name: string;
    picture: string;
  }) {
    let user = await this.findByGoogleId(payload.googleId);

    if (!user) {
      user = await this.findByEmail(payload.email);
      if (user) {
        // existing email account — link googleId
        user.googleId = payload.googleId;
        user.avatar = user.avatar || payload.picture;
        user.provider = 'google';
        await user.save();
      } else {
        // brand new user
        user = new this.userModel({
          googleId: payload.googleId,
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
          provider: 'google',
          role: 'seller',
          isVerified: true,
        });
        await user.save();
      }
    }

    return user;
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
    const user = (await this.userModel
      .findByIdAndUpdate(id, data, { returnDocument: 'after' })
      .select('-password')
      .exec()) as UserDocument;

    if (!user) throw new NotFoundException('User not found');

    if (data.isVerified === true) {
      await this.mailService.sendApprovedEmail(
        user.email,
        user.name ?? '',
        'https://www.admasterlk.com/login',
      );
    }
    return user;
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
