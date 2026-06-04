import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { Ad, AdDocument } from '../ads/ads.schema';
import { Order, OrderDocument } from '../orders/orders.schema';
import { User, UserDocument } from '../users/users.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private catModel: Model<CategoryDocument>,
    @InjectModel(Ad.name) private adModel: Model<AdDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(data: Partial<Category>) {
    if (
      await this.catModel.findOne({
        categorySlug: this.convertToSlug(data.categoryName || ''),
      })
    ) {
      throw new NotFoundException('Category already exists');
    }
    const categorySlug = this.convertToSlug(data.categoryName || '');
    const createdCat = new this.catModel({ ...data, categorySlug });
    return createdCat.save();
  }

  async findAll() {
    return this.catModel.find().populate('ads');
  }

  async findOne(categorySlug: string) {
    const cat = await this.catModel.findOne({ categorySlug }).populate('ads');
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async update(id: string, data: Partial<Category>) {
    return this.catModel.findByIdAndUpdate(id, data, { new: true });
  }

  async addSubcategory(id: string, subcategoryName: string) {
    const subcategorySlug = this.convertToSlug(subcategoryName);
    return this.catModel.findByIdAndUpdate(
      id,
      { $push: { subcategory: { subcategoryName, subcategorySlug } } },
      { new: true },
    );
  }

  private async deleteAds(ads: AdDocument[]) {
    if (!ads.length) return;
    const adIds = ads.map((ad) => ad._id);
    await Promise.all(
      ads.flatMap((ad) =>
        ad.images.map((img) =>
          this.cloudinaryService.deleteImage(img.publicId),
        ),
      ),
    );
    await Promise.all([
      this.orderModel.deleteMany({ ad: { $in: adIds } }),
      this.userModel.updateMany(
        { ads: { $in: adIds } },
        { $pull: { ads: { $in: adIds } } },
      ),
      this.adModel.deleteMany({ _id: { $in: adIds } }),
    ]);
  }

  async remove(id: string) {
    const cat = await this.catModel.findById(id);
    if (!cat) throw new NotFoundException('Category not found');
    const ads = await this.adModel.find({ categorySlug: cat.categorySlug });
    await this.deleteAds(ads);
    return this.catModel.findByIdAndDelete(id);
  }

  async removeSubcategory(id: string, subId: string) {
    const cat = await this.catModel.findById(id);
    if (!cat) throw new NotFoundException('Category not found');
    const sub = cat.subcategory.find((s: any) => s._id.toString() === subId);
    if (!sub) throw new NotFoundException('Subcategory not found');
    const ads = await this.adModel.find({
      subCategorySlug: sub.subcategorySlug,
    });
    await this.deleteAds(ads);
    return this.catModel.findByIdAndUpdate(
      id,
      { $pull: { subcategory: { _id: subId } } },
      { new: true },
    );
  }

  convertToSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
