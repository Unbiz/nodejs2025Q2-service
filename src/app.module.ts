import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AlbumModule } from './modules/album.module';
import { ArtistModule } from './modules/artist.module';
import { TrackModule } from './modules/track.module';
import { UserModule } from './modules/user.module';
import { FavoritesModule } from './modules/favorites.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AlbumModule,
    ArtistModule,
    TrackModule,
    UserModule,
    FavoritesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
