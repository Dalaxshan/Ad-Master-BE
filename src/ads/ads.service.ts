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
import { Category, CategoryDocument } from 'src/categories/categories.schema';

@Injectable()
export class AdsService {
  constructor(
    @InjectModel(Ad.name) private adModel: Model<AdDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private catModel: Model<CategoryDocument>,
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

    const adSlug = this.createAdSlug(dto.title);
    const categorySlug = this.createAdSlug(dto.category);
    const subCategorySlug = this.createAdSlug(dto.subcategory ?? '');

    const ad = await this.adModel.create({
      ...dto,
      adSlug: adSlug,
      categorySlug: categorySlug,
      subCategorySlug: subCategorySlug,
      boostAds: dto.boostAds,
      seller: sellerId,
      images: images
        .filter((img) => img !== null && img !== undefined)
        .map((img) => ({
          url: img.secure_url,
          publicId: img.public_id,
        })),
    });

    // await this.calculateTotalCharge(ad._id.toString());
    await this.userModel.findByIdAndUpdate(sellerId, {
      $push: { ads: ad._id },
    });

    await this.ordersService.create(ad._id.toString(), sellerId);

    const cat = await this.catModel.findOne({
      categoryName: { $regex: `^${dto.category}$`, $options: 'i' },
    });
    if (!cat) throw new NotFoundException('Category not found');

    await this.catModel.findByIdAndUpdate(cat._id, { $push: { ads: ad._id } });

    return ad;
  }

  slugToLabel(slug: string) {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  findAll(query: any = {}) {
    const filter: any = {};
    if (query.category)
      filter.category = {
        $regex: `^${this.slugToLabel(query.category)}$`,
        $options: 'i',
      };
    if (query.adSlug) filter.adSlug = query.adSlug;
    if (query.district) filter.district = query.district;
    if (query.subcategory) filter.subcategory = query.subcategory;
    if (query.search) filter.title = { $regex: query.search, $options: 'i' };
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }
    const sortMap: Record<string, any> = {
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
    };
    const sort = sortMap[query.sort] ?? { createdAt: -1 };

    return this.adModel
      .find(filter)
      .populate('seller', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 });
  }

  async findOneBySlug(slug: string) {
    const ad = await this.adModel
      .findOne({ adSlug: slug })
      .populate('seller', '-password');
    if (!ad) throw new NotFoundException('Ad not found');
    return ad;
  }

  async findOne(id: string) {
    const ad = await this.adModel.findById(id).populate('seller', '-password');
    if (!ad) throw new NotFoundException('Ad not found');
    return ad;
  }

  async findByCategory(
    categorySlug: string,
    subCategorySlug: string,
    query: any = {},
  ) {
    const filter: any = { categorySlug, subCategorySlug };
    if (query.district) filter.district = query.district;
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    const sortMap: Record<string, any> = {
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
    };
    const sort = sortMap[query.sort] ?? { createdAt: -1 };

    return this.adModel.find(filter).populate('seller', '-password').sort(sort);
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

  async updateStatus(id: string, status: string) {
    const ad = await this.adModel.findById(id);
    if (!ad) throw new NotFoundException('Ad not found');
    return this.adModel.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after' },
    );
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
    await Promise.all([
      this.adModel.findByIdAndDelete(id),
      this.userModel.findByIdAndUpdate(ad.seller, {
        $pull: { ads: ad._id },
      }),
    ]);
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

  // async calculateTotalCharge(adId: string) {
  //   const ad = await this.adModel.findById(adId);
  //   if (!ad) throw new NotFoundException('Ad not found');
  //   let totalCharge = 0;
  //   if (ad.plan) totalCharge += ad.plan.planCharge;
  //   if (ad.boostAds) {
  //     totalCharge += ad.boostAds.reduce(
  //       (sum, boostAd) => sum + boostAd.boostCharge,
  //       0,
  //     );
  //   }
  //   const updatedAd = await this.adModel.findByIdAndUpdate(
  //     adId,
  //     { totalAmount: totalCharge },
  //     { returnDocument: 'after' },
  //   );
  //   return updatedAd?.totalAmount;
  // }

  createAdSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
