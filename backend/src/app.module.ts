import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from './media/media.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MediaModule,
    MinioClientModule,
    MinioClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'backend.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
