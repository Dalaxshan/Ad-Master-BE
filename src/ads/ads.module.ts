import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';

import { Ad, AdSchema } from './ads.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { OrdersModule } from 'src/orders/orders.module';
import { Category, CategorySchema } from 'src/categories/categories.schema';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Reflector } from '@nestjs/core';
import { R2Module } from 'src/r2/r2.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ad.name, schema: AdSchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    R2Module,
    OrdersModule,
  ],
  providers: [AdsService, RolesGuard, Reflector],
  controllers: [AdsController],
})
export class AdsModule {}
