import { Injectable } from '@nestjs/common';
import { MinioClientService } from '../minio-client/minio-client.service';
import { BufferedFile } from '../minio-client/file.model';

@Injectable()
export class MediaService {
  constructor(private readonly minioService: MinioClientService) {}

  async getBucketList() {
    return this.minioService.client.listObjectsV2('test');
  }

  async uploadBuffer(file: BufferedFile) {
    return this.minioService.upload(file, 'test');
  }
}
