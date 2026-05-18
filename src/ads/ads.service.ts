import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ad, AdDocument } from './ads.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { User, UserDocument } from 'src/users/users.schema';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class AdsService {
  constructor(
    @InjectModel(Ad.name) private adModel: Model<AdDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
    private ordersService: OrdersService,
  ) {}

  async create(
    dto: CreateAdDto,
    files: Express.Multer.File[],
    sellerId: string,
  ): Promise<AdDocument> {
    const images = await Promise.all(
      files.map((f) => this.cloudinaryService.uploadImage(f)),
    );
    const ad = await this.adModel.create({
      ...dto,
      boostAds: dto.boostAds,
      seller: sellerId,
      images: images
        .filter((img) => img !== null && img !== undefined)
        .map((img) => ({
          url: img.secure_url,
          publicId: img.public_id,
        })),
    });

    await this.calculateTotalCharge(ad._id.toString());
    await this.userModel.findByIdAndUpdate(sellerId, {
      $push: { ads: ad._id },
    });

    await this.ordersService.create(ad._id.toString(), sellerId);

    return ad;
  }

  findAll(query: any = {}) {
    const filter: any = {};
    if (query.category) filter.category = query.category;
    if (query.district) filter.district = query.district;
    if (query.subcategory) filter.subcategory = query.subcategory;
    if (query.search) filter.title = { $regex: query.search, $options: 'i' };
    return this.adModel
      .find(filter)
      .populate('seller', '-password')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const ad = await this.adModel.findById(id).populate('seller', '-password');
    if (!ad) throw new NotFoundException('Ad not found');
    return ad;
  }

  async update(id: string, data: Partial<Ad>, userId: string, role: string) {
    const ad = await this.adModel.findById(id);
    if (!ad) throw new NotFoundException('Ad not found');
    if (ad.seller.toString() !== userId && role !== 'admin')
      throw new ForbiddenException();
    return this.adModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
    });
  }

  async remove(id: string, userId: string, role: string) {
    const ad = await this.adModel.findById(id);
    if (!ad) throw new NotFoundException('Ad not found');
    if (ad.seller.toString() !== userId && role !== 'admin')
      throw new ForbiddenException();
    if (ad.images && ad.images.length > 0) {
      await Promise.all(
        ad.images.map((img) =>
          this.cloudinaryService.deleteImage(img.publicId),
        ),
      );
    }
    await this.adModel.findByIdAndDelete(id);
    await this.userModel.findByIdAndUpdate(userId, { $pull: { ads: id } });
  }

  async boostAd(id: string, boostData: any, userId: string) {
    const ad = await this.adModel.findById(id);
    if (!ad) throw new NotFoundException('Ad not found');
    if (ad.seller.toString() !== userId) throw new ForbiddenException();
    return this.adModel.findByIdAndUpdate(
      id,
      {
        $push: { boostAds: boostData },
        $inc: { totalAmount: boostData.amount },
      },
      { returnDocument: 'after' },
    );
  }

  async calculateTotalCharge(adId: string) {
    const ad = await this.adModel.findById(adId);
    if (!ad) throw new NotFoundException('Ad not found');
    let totalCharge = 0;
    if (ad.plan) totalCharge += ad.plan.planCharge;
    if (ad.boostAds) {
      totalCharge += ad.boostAds.reduce(
        (sum, boostAd) => sum + boostAd.boostCharge,
        0,
      );
    }
    const updatedAd = await this.adModel.findByIdAndUpdate(
      adId,
      { totalAmount: totalCharge },
      { returnDocument: 'after' },
    );
    return updatedAd?.totalAmount;
  }
}
