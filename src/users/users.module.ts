import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, RolesGuard, Reflector],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
