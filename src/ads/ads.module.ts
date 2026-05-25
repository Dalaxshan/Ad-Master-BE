import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Ad, AdSchema } from './ads.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { OrdersModule } from 'src/orders/orders.module';
import { Category, CategorySchema } from 'src/categories/categories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ad.name, schema: AdSchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CloudinaryModule,
    OrdersModule,
  ],
  providers: [AdsService],
  controllers: [AdsController],
})
export class AdsModule {}
