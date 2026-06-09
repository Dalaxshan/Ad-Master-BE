import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFile,
  UseInterceptors,
  Param,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from './r2.service';
import { v4 as uuid } from 'uuid';

@Controller('r2')
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  // Direct upload via backend
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.r2Service.uploadFile(file);
    return result;
  }

  // Get presigned URL for frontend direct upload
  @Post('presign')
  async presign(@Body() body: { filename: string; contentType: string }) {
    const key = `uploads/${uuid()}-${body.filename}`;
    const url = await this.r2Service.getPutPresignedUrl(key, body.contentType);
    return { url, key };
  }

  // Get presigned download URL
  @Get('file/:key')
  async getFile(@Param('key') key: string) {
    const url = await this.r2Service.getPresignedUrl(decodeURIComponent(key));
    return { url };
  }

  // Delete a file
  @Delete('file/:key')
  async deleteFile(@Param('key') key: string) {
    await this.r2Service.deleteImage(decodeURIComponent(key));
    return { success: true };
  }
}
