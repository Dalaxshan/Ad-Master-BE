import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Ad, AdSchema } from './ads.schema';
import { User, UserSchema } from 'src/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ad.name, schema: AdSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CloudinaryModule,
  ],
  providers: [AdsService],
  controllers: [AdsController],
})
export class AdsModule {}