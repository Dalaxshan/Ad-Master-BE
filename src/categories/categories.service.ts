import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './categories.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private catModel: Model<CategoryDocument>,
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

  async remove(id: string) {
    return this.catModel.findByIdAndDelete(id);
  }

  async removeSubcategory(id: string, subId: string) {
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
