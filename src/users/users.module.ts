import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Reflector } from '@nestjs/core';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
  ],
  providers: [UsersService, RolesGuard, Reflector],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
