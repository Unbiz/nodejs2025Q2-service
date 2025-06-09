import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from '../models/entities/track.entity';
import { Favorites } from '../models/entities/favorites.entity';
import { TrackService } from '../services/track.service';
import { TrackController } from '../controllers/track.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Favorites])],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
