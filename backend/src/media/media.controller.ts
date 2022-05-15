import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { BufferedFile } from '../minio-client/file.model';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('bucket')
  async getBuckets() {
    return await this.mediaService.getBucketList();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(@UploadedFile() file: BufferedFile) {
    if (!file) {
      return new HttpException('file not found', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.mediaService.uploadBuffer(file);
    } catch (error) {
      return error;
    }
  }
}
