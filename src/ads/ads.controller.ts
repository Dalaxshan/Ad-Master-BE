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

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  findAll(@Query() query) {
    return this.adsService.findAll(query);
  }

  @Get(':adSlug')
  findOneBySlug(@Param('adSlug') adSlug: string) {
    return this.adsService.findOneBySlug(adSlug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10, { storage: memoryStorage() }))
  create(
    @Body() dto: CreateAdDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
  ) {
    return this.adsService.create(dto, files || [], '6a054a43d2c284c9bb07eea0');
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
