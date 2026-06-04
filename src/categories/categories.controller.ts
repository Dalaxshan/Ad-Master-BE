import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get() findAll() {
    return this.categoriesService.findAll();
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() body) {
    return this.categoriesService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() body) {
    return this.categoriesService.update(id, body);
  }

  @Patch(':id/subcategory')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addSubcategory(
    @Param('id') id: string,
    @Body('subcategoryName') subcategoryName: string,
  ) {
    return this.categoriesService.addSubcategory(id, subcategoryName);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Delete(':id/subcategory/:subId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeSubcategory(@Param('id') id: string, @Param('subId') subId: string) {
    return this.categoriesService.removeSubcategory(id, subId);
  }
}
