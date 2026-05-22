import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './categories.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private catModel: Model<CategoryDocument>,
  ) {}

  create(data: Partial<Category>) {
    return this.catModel.create(data);
  }

  findAll() {
    return this.catModel.find().populate('ads');
  }

  async findOne(categorySlug: string) {
    const cat = await this.catModel.findOne({ categorySlug }).populate('ads');
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  update(id: string, data: Partial<Category>) {
    return this.catModel.findByIdAndUpdate(id, data, { new: true });
  }

  remove(id: string) {
    return this.catModel.findByIdAndDelete(id);
  }
}
