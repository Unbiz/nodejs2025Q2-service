import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from '../models/entities/artist.entity';
import { Track } from '../models/entities/track.entity';
import { Favorites } from '../models/entities/favorites.entity';
import { ArtistService } from '../services/artist.service';
import { ArtistController } from '../controllers/artist.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Track, Favorites]), AuthModule],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
