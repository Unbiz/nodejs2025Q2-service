import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '../models/entities/album.entity';
import { Track } from '../models/entities/track.entity';
import { Favorites } from '../models/entities/favorites.entity';
import { AlbumService } from '../services/album.service';
import { AlbumController } from '../controllers/album.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Track, Favorites])],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
