import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/role-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  findAll(@Query() query) {
    return this.adsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOneByIdOrSlug(id);
  }

  @Get(':category/:subcategory')
  findByCategory(
    @Param('category') category: string,
    @Param('subcategory') subcategory: string,
    @Query() query,
  ) {
    return this.adsService.findByCategory(category, subcategory, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10, { storage: memoryStorage() }))
  create(
    @Body() dto: CreateAdDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    return this.adsService.create(dto, files || [], req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body, @Req() req) {
    return this.adsService.update(id, body, req.user.userId, req.user.role);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() body, @Req() req) {
    return this.adsService.updateStatus(id, body.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string, @Req() req) {
    return this.adsService.remove(id, req.user.userId, 'admin');
  }

  @Post(':id/boost')
  @UseGuards(JwtAuthGuard)
  boostAd(@Param('id') id: string, @Body() body, @Req() req) {
    return this.adsService.boostAd(id, body, req.user.userId);
  }
}
