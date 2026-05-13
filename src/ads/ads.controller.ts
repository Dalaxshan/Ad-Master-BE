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

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  findAll(@Query() query) {
    return this.adsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.adsService.remove(id, req.user.userId, req.user.role);
  }

  @Post(':id/boost')
  @UseGuards(JwtAuthGuard)
  boostAd(@Param('id') id: string, @Body() body, @Req() req) {
    return this.adsService.boostAd(id, body, req.user.userId);
  }
}
