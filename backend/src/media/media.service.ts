import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MinioClientService } from '../minio-client/minio-client.service';
import { BufferedFile } from '../minio-client/file.model';

@Injectable()
export class MediaService {
  constructor(private readonly minioService: MinioClientService) {
    this.logger = new Logger('MediaService');
  }

  private readonly logger: Logger;

  async getObjectList() {
    const bucketName: string = process.env.MINIO_BUCKET_NAME;
    const objects = [];
    if (!(await this.minioService.client.bucketExists(bucketName))) {
      throw new HttpException('Bucket not found', HttpStatus.BAD_REQUEST);
    }
    const stream = this.minioService.client.listObjects(bucketName, '', true);
    return new Promise((resolve, reject) => {
      stream.on('data', (data) =>
        objects.push({
          ...data,
          url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${data.name}`,
        }),
      );
      stream.on('end', () => {
        this.logger.log('Got all bucket objects');
        resolve(objects);
      });
      stream.on('error', (error) => {
        this.logger.error(error);
        reject('Could not load objects in bucket');
      });
    });
  }

  async uploadBuffer(file: BufferedFile) {
    return this.minioService.upload(file, process.env.MINIO_BUCKET_NAME);
  }
}
