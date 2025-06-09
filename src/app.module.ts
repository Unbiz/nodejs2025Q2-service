import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { ArtistController } from './controllers/artist.controller';
import { AlbumController } from './controllers/album.controller';
import { TrackController } from './controllers/track.controller';
import { FavoritesController } from './controllers/favorites.controller';
import { StorageService } from './services/storage.service';
import { UserService } from './services/user.service';
import { ArtistService } from './services/artist.service';
import { AlbumService } from './services/album.service';
import { TrackService } from './services/track.service';
import { FavoritesService } from './services/favorites.service';

@Module({
  controllers: [
    UserController,
    ArtistController,
    AlbumController,
    TrackController,
    FavoritesController,
  ],
  providers: [
    StorageService,
    UserService,
    ArtistService,
    AlbumService,
    TrackService,
    FavoritesService,
  ],
})
export class AppModule {}
