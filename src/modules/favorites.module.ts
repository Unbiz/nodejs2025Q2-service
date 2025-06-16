import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from '../models/entities/favorites.entity';
import { Artist } from '../models/entities/artist.entity';
import { Album } from '../models/entities/album.entity';
import { Track } from '../models/entities/track.entity';
import { FavoritesService } from '../services/favorites.service';
import { FavoritesController } from '../controllers/favorites.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorites, Artist, Album, Track]),
    AuthModule,
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
