import { Module } from '@nestjs/common';
import { InMemoryDBService } from './services/in-memory-db.service';
import { UserController } from './controllers/user.controller';
import { ArtistController } from './controllers/artist.controller';
import { AlbumController } from './controllers/album.controller';
import { TrackController } from './controllers/track.controller';
import { FavoritesController } from './controllers/favorites.controller';

@Module({
  controllers: [
    UserController,
    ArtistController,
    AlbumController,
    TrackController,
    FavoritesController,
  ],
  providers: [InMemoryDBService],
})
export class AppModule {}
