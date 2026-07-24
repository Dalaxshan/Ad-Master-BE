import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin, AdminSchema } from '../auth/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        secret: c.get('JWT_SECRET'),
        signOptions: { expiresIn: c.get('JWT_EXPIRES_IN') ?? '15m' },
      }),
    }),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
