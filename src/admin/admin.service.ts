import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from '../auth/admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}

  async create(dto: any) {
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.adminModel.create({ ...dto, password: hashed });
  }

  async login(dto: any) {
    const admin = await this.adminModel.findOne({ email: dto.email });
    if (!admin) throw new Error('Invalid email');
    const valid = await bcrypt.compare(dto.password, admin.password);
    if (!valid) throw new Error('Invalid password');
    const token = this.jwtService.sign({
      sub: admin._id,
      email: admin.email,
      role: 'admin',
    });
    return { token };
  }
}
