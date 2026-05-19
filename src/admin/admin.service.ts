import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Admin, AdminDocument } from 'src/auth/admin.schema';

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

  async login(dto: any, res: Response) {
    const admin = await this.adminModel.findOne({ email: dto.email });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: admin._id,
      email: admin.email,
      role: 'admin',
    });

    // ✅ Set as HttpOnly cookie instead of returning in body
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: 'Login successful',
      user: { id: admin._id, email: admin.email, role: admin.role },
    };
  }
}
